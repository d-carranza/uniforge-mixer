import mergeImages from "merge-images";

export async function areChangesSaved(state) {
  // Fetch the stored state from the database
  const response = await fetch("/storedtraits", {
    method: "POST",
  });
  const result = await response.json();
  const storedState = await JSON.parse(result);

  // Compare stored state with the current state and return true or false
  const storedAttributes = JSON.stringify(storedState.attributes);
  const currentAttributes = JSON.stringify(state.attributes);
  if (storedAttributes === currentAttributes) return true;
  return false;
}

export function createMetadata(supply, attributes) {
  const metadata = [];
  const generatedValues = new Set();

  for (let n = 1; n <= supply; n++) {
    const token = {};
    const tokenAttributes = [];

    // Get one trait for each type
    for (const type of attributes) {
      // Set the rarities and values for this trait_type
      const traitAttributes = {};
      const rarities = [];
      const values = [];
      for (const trait of type.traits) {
        rarities.push(trait.rarity);
        values.push(trait.value);
      }

      // Return a value randomly
      function randvalue() {
        const ar = [];
        let i;
        let sum = 0;
        for (i = 0; i < rarities.length - 1; i++) {
          sum += rarities[i] / 100.0;
          ar[i] = sum;
        }
        const r = Math.random();
        for (i = 0; i < ar.length && r >= ar[i]; i++);

        return values[i];
      }

      // Add trait_type and value pairs to the attributes parent
      traitAttributes.trait_type = type.trait_type;
      traitAttributes.value = randvalue();

      tokenAttributes.push(traitAttributes);
    }

    // Avoid duplicates algorithm
    let newValues = "";
    for (const tokenAttribute of tokenAttributes)
      newValues += tokenAttribute.value;

    if (!generatedValues.has(newValues)) {
      token.token_id = String(n); // Define token number "string"
      token.attributes = tokenAttributes; // Define token attributes
      metadata.push(token); // Add token to the metadata
    } else n--, console.info("duplicate avoided");

    // Add newValues to generatedValues set
    generatedValues.add(newValues);
  }
  return metadata;
}

export function createMetadataDuplicates(supply, attributes) {
  const metadata = [];
  const generatedValues = new Set();

  for (let n = 1; n <= supply; n++) {
    const token = {};
    const tokenAttributes = [];

    // Get one trait for each type
    for (const type of attributes) {
      // Set the rarities and values for this trait_type
      const traitAttributes = {};
      const rarities = [];
      const values = [];
      for (const trait of type.traits) {
        rarities.push(trait.rarity);
        values.push(trait.value);
      }

      // Return a value randomly
      function randvalue() {
        const ar = [];
        let i;
        let sum = 0;
        for (i = 0; i < rarities.length - 1; i++) {
          sum += rarities[i] / 100.0;
          ar[i] = sum;
        }
        const r = Math.random();
        for (i = 0; i < ar.length && r >= ar[i]; i++);

        return values[i];
      }

      // Add trait_type and value pairs to the attributes parent
      traitAttributes.trait_type = type.trait_type;
      traitAttributes.value = randvalue();

      tokenAttributes.push(traitAttributes);
    }

    // Avoid duplicates algorithm
    let newValues = "";
    for (const tokenAttribute of tokenAttributes)
      newValues += tokenAttribute.value;

    if (!generatedValues.has(newValues)) {
      token.token_id = String(n); // Define token number "string"
      token.attributes = tokenAttributes; // Define token attributes
      metadata.push(token); // Add token to the metadata
    } else {
      token.token_id = String(n); // Define token number "string"
      token.attributes = tokenAttributes; // Define token attributes
      metadata.push(token); // Add token to the metadata
    }

    // Add newValues to generatedValues set
    generatedValues.add(newValues);
  }
  return metadata;
}

export async function createImages(state, metadata) {
  // 1. Get an array containing arrays for every token's trait dataURLs.
  const dataUrlArrays = [];

  // For each metadata's attribute
  for (const token of metadata) {
    const attributes = token.attributes;
    const tokenbase64pnglist = [];
    const traitPairs = {};

    for (const attribute of attributes) {
      const key = attribute.trait_type;
      const value = attribute.value;
      traitPairs[key] = value;
    }
    const keys = Object.keys(traitPairs);

    // Find the same attribute in the state, then find the same trait
    for (const key of keys)
      for (const stateAttrib of state.attributes)
        if (stateAttrib.trait_type === key)
          for (const trait of stateAttrib.traits)
            for (const attribute of attributes)
              if (
                attribute.trait_type === key &&
                attribute.value === trait.value
              )
                // When found, push it's img in the img array
                tokenbase64pnglist.push(trait.img);
    // And push the array to the whole collection
    dataUrlArrays.push(tokenbase64pnglist);
  }

  // 2. Merge images to create the final image for every token
  const allMergedTokens = [];
  for (const dataUrlArray of dataUrlArrays) {
    const image = await mergeImages(dataUrlArray);
    allMergedTokens.push(image);
  }
  //The output of this function is the array wit all the merged token's dataUrls
  return allMergedTokens;
}

export async function dataURLtoFile(url, filename) {
  const data = await fetch(url);
  const blob = await data.blob();
  blob.name = filename;
  return blob;
}
