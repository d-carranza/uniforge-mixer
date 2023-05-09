import React from "react";
import {
  createMetadata,
  createImages,
  dataURLtoFile,
  createMetadataDuplicates,
} from "../utils/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function Buttons(props) {
  const { state } = props;

  async function createCollection() {
    const supply = state.supply;
    const attributes = state.attributes;

    // Require changes to be saved
    // const changesSaved = await areChangesSaved(state);
    // if (!changesSaved)
    //   return alert("Save your changes before creating your collection.");

    // Require user to modify default state
    // if (!attributes[0].trait_type)
    //   return alert("Enter your traits before creating your collection.");

    // Filter valid supply input
    let maxSupply = 1;
    for (const type of state.attributes)
      if (type.traits.length > 0) maxSupply *= type.traits.length;
    if (supply > maxSupply)
      return alert(
        `Supply too large: Your collection has a maximum of ${maxSupply} unique combinations.`
      );
    if (!supply || supply <= 0 || (supply * 2) % 2 != 0)
      return alert("Invalid Supply: Enter a valid value.");

    // Create  metadata
    const metadata = createMetadata(supply, attributes);
    const jsonMetadata = JSON.stringify(metadata);

    // Create and merge token's base64 images
    const b64Images = await createImages(state, metadata);

    // Convert b64 to png images
    const pngImages = [];
    let id = 1;
    for (const b64Image of b64Images) {
      const blob = await dataURLtoFile(b64Image, `${id}.png`);
      id++;
      pngImages.push(blob);
    }

    // Download files with Jszip and FileSaver libraries
    const zip = new JSZip();
    zip.file("metadata.json", jsonMetadata); // Add metadata.json
    const img = zip.folder("images"); // Add ordered .pngs to "images" root
    let n = 1;
    for (const pngImage of pngImages)
      img.file(`${n}.png`, pngImage, { base64: true }), n++;

    const content = await zip.generateAsync({ type: "blob" });
    return saveAs(content, "mixer-collection");
  }

  async function createCollectionRepeated() {
    const supply = state.supply;
    const attributes = state.attributes;

    // Create  metadata
    const metadata = createMetadataDuplicates(supply, attributes);
    const jsonMetadata = JSON.stringify(metadata);

    // Create and merge token's base64 images
    const b64Images = await createImages(state, metadata);

    // Convert b64 to png images
    const pngImages = [];
    let id = 1;
    for (const b64Image of b64Images) {
      const blob = await dataURLtoFile(b64Image, `${id}.png`);
      id++;
      pngImages.push(blob);
    }

    // Download files with Jszip and FileSaver libraries
    const zip = new JSZip();
    zip.file("metadata.json", jsonMetadata); // Add metadata.json
    const img = zip.folder("images"); // Add ordered .pngs to "images" root
    let n = 1;
    for (const pngImage of pngImages)
      img.file(`${n}.png`, pngImage, { base64: true }), n++;

    const content = await zip.generateAsync({ type: "blob" });
    return saveAs(content, "mixer-collection");
  }

  return (
    <div className="buttons">
      <button className="app-btn" onClick={createCollection}>
        Create Collection
      </button>
      <button className="app-btn" onClick={createCollectionRepeated}>
        Create Duplicates
      </button>
    </div>
  );
}

export default Buttons;
