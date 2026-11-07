
import qrcode

# Diwali QR Code Generator

print("================================")
print("     🪔 DIWALI QR GENERATOR 🪔")
print("================================")

# Ask for website address
website_url = input("Enter your Diwali website URL: ")

# Check URL
if not website_url.startswith("https://"):
    print("Please enter a valid HTTPS website URL.")

else:
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=5
    )

    qr.add_data(website_url)
    qr.make(fit=True)

    # Generate QR image
    img = qr.make_image(
        fill_color="#8B4513",
        back_color="#FFF5DC"
    )

    # Save QR code
    img.save("My_Diwali_QR.png")

    print("\nYour Diwali QR code is ready! 🪔")
    print("Saved as: My_Diwali_QR.png")
