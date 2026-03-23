import sys
from PIL import Image, ImageDraw

def perfect_crop(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    
    magenta = (255, 0, 255, 255)
    
    # 1. Flood-fill from corners using a very generous threshold 
    # to conquer any fuzzy JPEG compression artifacts in the whitespace
    ImageDraw.floodfill(img, (0, 0), magenta, thresh=50)
    ImageDraw.floodfill(img, (w-1, 0), magenta, thresh=50)
    ImageDraw.floodfill(img, (0, h-1), magenta, thresh=50)
    ImageDraw.floodfill(img, (w-1, h-1), magenta, thresh=50)
    
    pixels = img.load()
    
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    
    # 2. Scan for bounding box of everything that is NOT magenta
    for y in range(h):
        for x in range(w):
            if pixels[x, y] != magenta:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    # Add safety padding
    min_x = max(0, min_x - 5)
    min_y = max(0, min_y - 5)
    max_x = min(w - 1, max_x + 5)
    max_y = min(h - 1, max_y + 5)
    
    if max_x >= min_x and max_y >= min_y:
        cropped = img.crop((min_x, min_y, max_x, max_y))
        
        # 3. Swap magenta to transparent
        cw, ch = cropped.size
        cpixels = cropped.load()
        for y in range(ch):
            for x in range(cw):
                if cpixels[x, y] == magenta:
                    cpixels[x, y] = (255, 255, 255, 0)
        
        cropped.save(output_path, "PNG")
        print(f"Success! Perfect crop from {w}x{h} to {cw}x{ch}")
    else:
        print("Error: Entire image was flood-filled.")

if __name__ == "__main__":
    perfect_crop(sys.argv[1], sys.argv[2])
