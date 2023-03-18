import React, { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageCropper() {
    const [file, selectFile] = useState(null);
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState();
    const [crop2, setCrop2] = useState();
    const [fileimage, setFileImage] = useState(null);
    const [aspect, setAspect] = useState({
        unit: "px",
        x: 20,
        y: 40,
        height: 10,
        width: 20,
    });

    const [imagedata, setImagedata] = useState({
        xcoordinate: "",
        ycoordinate: "",
        height: "",
        width: "",
    });

    useEffect(() => {
        const baseimageurl = "./images/testplan (1).png";

        convertNormalImagetoBase64(baseimageurl, function (dataUrl) {
            console.log("RESULT:", dataUrl);

            selectFile(dataUrl);
        });
    }, []);
    function convertNormalImagetoBase64(url, callback) {
        console.log("file", url);
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
                                console.log("newcrop", newcrop);
                                const { x, y, height, width } = newcrop;
                                setAspect({
                                    ...aspect,
                                    x: x,
                                    y: y,
                                    height,
                                    width,
                                });
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
            <div className="row">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        console.log("File", e.target.files[0]);
                        var file = e.target.files[0];
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            console.log("RESULT", reader.result);
                            setFileImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                    }}
                />
                <ReactCrop
                    crop={aspect}
                    onChange={(filecrop) => {
                        const { x, y, height, width } = filecrop;
                        setAspect({ ...aspect, x: x, y: y, height, width });
                    }}
                >
                    <img src={fileimage} />
                </ReactCrop>
            </div>
        </div>
    );
}

export default ImageCropper;
