"""Compare canvas UI against the reference, excluding page interiors and named approved changes."""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageStat


def compare(actual_path, output_dir, approved_changes=()):
    references = Path(__file__).resolve().parents[1] / "references"
    baseline = json.loads((references / "canvas-baseline.json").read_text())
    reference_path = references / baseline["reference"]
    if hashlib.sha256(reference_path.read_bytes()).hexdigest() != baseline["sha256"]:
        raise ValueError("The reference image changed. Restore the supplied baseline.")

    reference = Image.open(reference_path).convert("RGB")
    actual = Image.open(actual_path).convert("RGB")
    if actual.size != reference.size:
        raise ValueError(f"Expected {reference.size} pixels, got {actual.size}. Do not resize the baseline.")

    mask = Image.new("L", reference.size, 255)
    draw = ImageDraw.Draw(mask)
    for page in baseline["pageInteriors"]:
        draw.rectangle((page["left"], page["top"], page["right"] - 1, page["bottom"] - 1), fill=0)
    changes = []
    for name in approved_changes:
        change = baseline.get("approvedChanges", {}).get(name)
        if change is None:
            raise ValueError(f"Unknown approved change: {name}")
        for left, top, right, bottom in change["regions"]:
            draw.rectangle((left, top, right - 1, bottom - 1), fill=0)
        changes.append({"id": name, **change})

    delta = ImageChops.difference(reference, actual)
    changed = ImageChops.lighter(ImageChops.lighter(*delta.split()[:2]), delta.split()[2]).point(lambda value: 255 if value else 0)
    changed = ImageChops.multiply(changed, mask)

    def measure(box=None):
        region_mask = mask.crop(box) if box else mask
        region_changed = changed.crop(box) if box else changed
        pixels = region_mask.histogram()[255]
        different = region_changed.histogram()[255]
        means = ImageStat.Stat(delta.crop(box) if box else delta, region_mask).mean if pixels else [0, 0, 0]
        return {
            "excluded": pixels == 0,
            "comparedPixels": pixels,
            "differentPixels": different,
            "differentPercent": round(100 * different / pixels, 4) if pixels else 0,
            "meanChannelError": round(sum(means) / 3, 4),
        }

    report = {
        "reference": str(reference_path),
        "actual": str(Path(actual_path).resolve()),
        "baselineSha256": baseline["sha256"],
        "size": list(reference.size),
        "excluded": baseline["pageInteriors"],
        "approvedChanges": changes,
        "overall": measure(),
        "regions": {name: measure(box) for name, box in baseline["regions"].items()},
    }
    report["pixelExact"] = report["overall"]["differentPixels"] == 0
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    report_path = output_dir / "comparison.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    ImageChops.multiply(delta, Image.merge("RGB", (mask, mask, mask))).save(output_dir / "difference.png")
    overlay = reference.copy()
    overlay.paste(Image.new("RGB", reference.size, "#ed3480"), mask=changed)
    overlay.save(output_dir / "changed-pixels.png")
    print(json.dumps({"pixelExact": report["pixelExact"], **report["overall"], "report": str(report_path)}, indent=2))
    return report["pixelExact"]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("actual", type=Path, help="A screenshot at the baseline viewport and device scale.")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--approved-change", action="append", default=[], help="An explicit user-approved departure recorded in the baseline metadata.")
    args = parser.parse_args()
    raise SystemExit(0 if compare(args.actual, args.output, args.approved_change) else 1)
