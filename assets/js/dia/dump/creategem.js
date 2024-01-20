
function createCrystalGem() {
    const radius = 1;
    const height = 2;
    const numSides = 6;

    const vertices = [];
    const indices = [];

    // Generate vertices for top and bottom caps
    for (let i = 0; i < numSides; i++) {
        const angle = (Math.PI * 2 * i) / numSides;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = height / 2;

        vertices.push(x, y, z);
    }

    // Generate vertices for side faces
    for (let i = 0; i < numSides; i++) {
        const topIndex = i;
        const bottomIndex = (i + numSides) % numSides;

        const topVertex = [vertices[3 * topIndex], vertices[3 * topIndex + 1], vertices[3 * topIndex + 2]];
        const bottomVertex = [vertices[3 * bottomIndex], vertices[3 * bottomIndex + 1], vertices[3 * bottomIndex + 2]];

        const sideLength = Math.sqrt(topVertex[0] * topVertex[0] + topVertex[1] * topVertex[1]);
        let sideMidpoint = [topVertex[0] + bottomVertex[0], topVertex[1] + bottomVertex[1], topVertex[2] + bottomVertex[2]];
        sideMidpoint = sideMidpoint.map((x) => x / 2);
        const sideMidpointOffset = [
            (sideMidpoint[1] * radius) / sideLength,
            (-sideMidpoint[0] * radius) / sideLength,
            0,
        ];

        const topSideVertex = [sideMidpointOffset[0] + sideMidpoint[0], sideMidpointOffset[1] + sideMidpoint[1], sideMidpoint[2]];
        const bottomSideVertex = [sideMidpointOffset[0] - sideMidpoint[0], sideMidpointOffset[1] - sideMidpoint[1], sideMidpoint[2]];

        vertices.push(...topSideVertex);
        vertices.push(...bottomSideVertex);

        const topSideIndex = 2 * numSides + 2 * i;
        const bottomSideIndex = 2 * numSides + 2 * i + 1;

        indices.push(bottomSideIndex, topIndex, topSideIndex);
        indices.push(bottomIndex, bottomSideIndex, topIndex);
    }

    // Generate faces for top cap
    for (let i = 0; i < numSides - 1; i++) {
        indices.push(i, i + 1, numSides - 1);
    }

    indices.push(numSides - 1, 0, numSides - 2);

    // Generate faces for bottom cap
    for (let i = 1; i < numSides; i++) {
        indices.push(2 * numSides - 1 - i, 2 * numSides - i, 2 * numSides - i - 1);
    }

    indices.push(2 * numSides - numSides, 2 * numSides, 2 * numSides - 1);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    //geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    // Material for the crystal
    const gemMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true });

    // Create the mesh using the geometry and material
    const gemMesh = new THREE.Mesh(geometry, gemMaterial);

    return gemMesh;
}

// Usage
const crystalGem = createCrystalGem();
this.scene.add(crystalGem);

crystalGem.position.x = 0;
crystalGem.position.y = 0;
crystalGem.position.z = 0;
crystalGem.geometry.scale(10,10,10);

this.primeGem = crystalGem;











const gemTexturePath = "assets/textures/dia_text_1.jpg"; // Use forward slashes in the path
        
// Load texture
const gemTexture = new THREE.TextureLoader().load(gemTexturePath);
/*new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: gemTexture, // Assign the loaded texture to the 'map' property
    transparent: true,
    refractionRatio: 0.95,
    blending: THREE.AdditiveBlending,
});
*/


new THREE.MeshPhongMaterial({
    specular: 0xff11cc,
    color: 0x3311cc,
    shininess: 50,
    emissive: 0,
    blending: THREE.NormalBlending,
    depthWrite: true,
    depthTest: 0,
});
