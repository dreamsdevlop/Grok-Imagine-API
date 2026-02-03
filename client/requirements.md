## Packages
(none needed)

## Notes
Frontend expects server to return base64 images in ImageGenerationResponse.images: { mimeType, dataBase64 }
Render images via data URLs: data:${mimeType};base64,${dataBase64}
All requests use credentials: "include"
Routes: / (generator), /history (history list + detail panel via route param)
