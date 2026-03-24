import os
from PIL import Image

src_img_path = r"C:\Users\Offic\.gemini\antigravity\brain\7501137a-af8a-4d9a-8d4b-7ad9cd426d8b\media__1774326821514.png"
output_dir = r"c:\Users\Offic\.gemini\antigravity\scratch\GembaOS_Project_V2\src\assets\icons"

os.makedirs(output_dir, exist_ok=True)

img = Image.open(src_img_path).convert("RGBA")

# Make white background transparent
datas = img.getdata()
new_data = []
for item in datas:
    # Change all pure white (or very close to white)
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)

width, height = img.size
cols = 5
rows = 2

icon_w = width // cols
icon_h = height // rows

icon_names = [
    "notion.png", "time.png", "waste.png", "scan.png", "tasks.png",
    "improv.png", "tasks_alt.png", "goals.png", "videos.png", "learn.png"
]

print(f"Image Size: {width}x{height}")
print(f"Icon Size: {icon_w}x{icon_h}")

idx = 0
for row in range(rows):
    for col in range(cols):
        left = col * icon_w
        top = row * icon_h
        right = (col + 1) * icon_w
        bottom = (row + 1) * icon_h
        
        # Crop the image
        img_cropped = img.crop((left, top, right, bottom))
        
        # We need to crop tightly to the non-transparent pixels to avoid huge margins
        bbox = img_cropped.getbbox()
        if bbox:
            img_cropped = img_cropped.crop(bbox)
        
        output_path = os.path.join(output_dir, icon_names[idx])
        img_cropped.save(output_path, "PNG")
        print(f"Saved {icon_names[idx]} to {output_path}")
        idx += 1

print("Done slicing icons.")
