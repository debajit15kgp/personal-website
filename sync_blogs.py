import os
import json
import re

BLOGS_DIR = "blogs"
REGISTRY_FILE = os.path.join(BLOGS_DIR, "registry.json")

def parse_frontmatter(content):
    """Simple parser for Markdown frontmatter."""
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return {}
    
    frontmatter = {}
    for line in match.group(1).split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            frontmatter[key.strip()] = value.strip().strip("'").strip('"')
    return frontmatter

def sync():
    blogs = []
    
    for filename in os.listdir(BLOGS_DIR):
        if filename == "registry.json" or not (filename.endswith(".md") or filename.endswith(".json")):
            continue
            
        path = os.path.join(BLOGS_DIR, filename)
        
        try:
            if filename.endswith(".json"):
                with open(path, "r") as f:
                    data = json.load(f)
                    blogs.append({
                        "path": path,
                        "title": data.get("title", "Untitled"),
                        "date": data.get("date", "2024-01-01")
                    })
            elif filename.endswith(".md"):
                with open(path, "r") as f:
                    content = f.read()
                    meta = parse_frontmatter(content)
                    blogs.append({
                        "path": path,
                        "title": meta.get("title", "Untitled"),
                        "date": meta.get("date", "2024-01-01")
                    })
        except Exception as e:
            print(f"Error parsing {filename}: {e}")

    # Sort by date (newest first)
    blogs.sort(key=lambda x: x["date"], reverse=True)

    with open(REGISTRY_FILE, "w") as f:
        json.dump(blogs, f, indent=2)
    
    print(f"✅ Sync complete! {len(blogs)} blogs registered in {REGISTRY_FILE}")

if __name__ == "__main__":
    sync()
