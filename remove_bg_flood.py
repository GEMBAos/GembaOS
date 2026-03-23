import sys
from PIL import Image, ImageDraw

def remove_background_floodfill(input_path, output_path):
    # Open image 
    img = Image.open(input_path).convert("RGBA")
    
    # We want to replace the background with magenta first (a unique color)
    magenta = (255, 0, 255, 255)
    
    # Flood-fill from top-left (0, 0)
    # We use a tolerance so we ignore JPEG compression artifacts on the white BG
    ImageDraw.floodfill(img, (0, 0), magenta, thresh=60)
    
    # Also flood-fill from other corners just in case 
    w, h = img.size
    ImageDraw.floodfill(img, (w-1, 0), magenta, thresh=60)
    ImageDraw.floodfill(img, (0, h-1), magenta, thresh=60)
    ImageDraw.floodfill(img, (w-1, h-1), magenta, thresh=60)

    # Now convert all magenta to transparent!
    datas = img.getdata()
    newData = []
    
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    
    x, y = 0, 0
    for item in datas:
        if item == magenta:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            # Track bounding box!
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y
            
        x += 1
        if x == w:
            x = 0
            y += 1
            
    img.putdata(newData)
    
    # Crop to the actual cart!
    if max_x >= min_x and max_y >= min_y:
        cropped = img.crop((min_x, min_y, max_x + 1, max_y + 1))
        # Add 5px padding
        cw, ch = cropped.size
        final = Image.new("RGBA", (cw + 10, ch + 10), (0,0,0,0))
        final.paste(cropped, (5, 5))
        final.save(output_path, "PNG")
        print(f"Success! Cropped to {cw+10}x{ch+10}")
    else:
        print("Failed to find bounding box. Saved full size.")
        img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_background_floodfill(sys.argv[1], sys.argv[2])
