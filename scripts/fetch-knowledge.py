"""Re-download the exact credited educational images in assets/knowledge/downloads.json."""
import concurrent.futures
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "assets" / "knowledge"
def download(pair):
    name, url = pair
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 StarStationEducational/1.0"})
    with urllib.request.urlopen(request, timeout=40) as response:
        data = response.read()
    if not (data.startswith(b"\xff\xd8") or data.startswith(b"\x89PNG\r\n\x1a\n")):
        raise ValueError(f"Expected JPEG or PNG image: {name}")
    (ROOT / name).write_bytes(data)
    return name, len(data)

if __name__ == "__main__":
    urls = json.loads((ROOT / "downloads.json").read_text(encoding="utf-8"))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for name, size in pool.map(download, urls.items()):
            print(f"{name}: {size} bytes")
