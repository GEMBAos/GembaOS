import sys
from PIL import Image

def crop_transparent(input_path, output_path):
    # Open the image
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    # Get the bounding box of the non-transparent pixels
    bbox = img.getbbox()
    
    if bbox:
        # Crop the image to the bounding box
        cropped_img = img.crop(bbox)
        # Add a tiny bit of padding just in case
        padding = 10
        width, height = cropped_img.size
        new_width = width + 2 * padding
        new_height = height + 2 * padding
        
        # Create a new blank transparent image with padding
        final_img = Image.new("RGBA", (new_width, new_height), (0, 0, 0, 0))
        final_img.paste(cropped_img, (padding, padding))
        
        final_img.save(output_path, "PNG")
        print(f"Success! Cropped {input_path} to {new_width}x{new_height}")
    else:
        print("Image is entirely transparent!")

if __name__ == "__main__":
    crop_transparent(sys.argv[1], sys.argv[2])
