import React, { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageCropper() {
    const [file, selectFile] = useState(null);
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState();
    const [imagedata, setImagedata] = useState({
        xcoordinate: "",
        ycoordinate: "",
        height: "",
        width: "",
    });

    useEffect(() => {
        const baseimageurl = "./images/testplan (1).png";
        function convertNormalImagetoBase64(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.send();
        }

        convertNormalImagetoBase64(baseimageurl, function (dataUrl) {
            console.log("RESULT:", dataUrl);

            selectFile(dataUrl);
        });
    }, []);
    function getCroppedImg(image, crop, fileName = "img") {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        //converting to base 64 image
        const base64Image = canvas.toDataURL("image/jpeg");
        return base64Image;
    }
    return (
        <div className="container">
            <div className="row">
                <div className="row">
                    <div className="col-6">
                        <h3>height:{imagedata.height}</h3>
                        <h4>X-co-ordinate:{imagedata.xcoordinate}</h4>
                    </div>
                    <div className="col-6">
                        <h3>Width:{imagedata.width}</h3>
                        <h4>Y-co-ordinate:{imagedata.ycoordinate}</h4>
                    </div>
                </div>
                <div className="col-6">
                    {file && (
                        <ReactCrop
                            crop={crop}
                            onComplete={(crop) => {
                                var element = document.getElementById("image");

                                const croppedImageUrl = getCroppedImg(
                                    element,
                                    crop
                                );

                                setImage(croppedImageUrl);
                            }}
                            onChange={(newcrop) => {
                                const { x, y, height, width } = newcrop;

                                setImagedata({
                                    ...imagedata,
                                    xcoordinate: x,
                                    ycoordinate: y,
                                    height: height,
                                    width: width,
                                });
                                setCrop(newcrop);
                            }}
                        >
                            <img src={file} id="image" />
                        </ReactCrop>
                    )}
                </div>

                <div className="col-6">
                    {image && (
                        <img
                            alt="Crop"
                            style={{ maxWidth: "100%" }}
                            src={image}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ImageCropper;
