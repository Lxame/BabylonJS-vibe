// Функция для создания точки
export function createPoint(position, scene, currentPoints) {
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
        diameter: 0.2,
        segments: 16
    }, scene);
    sphere.position = position;
    currentPoints.push(sphere);
    return sphere;
}

// Функция для создания линии между двумя точками
export function createLine(point1, point2, scene, allLines = []) {
    const points = [point1.position, point2.position];
    const lines = BABYLON.MeshBuilder.CreateLines("lines", {
        points: points,
        updatable: true
    }, scene);
    if (allLines) {
        allLines.push(lines);
    }
    return lines;
}

// Функция для создания треугольника по трем точкам
export function createTriangle(point1, point2, point3, scene) {
    try {
        // Создаем линии треугольника
        const line1 = createLine(point1, point2, scene);
        const line2 = createLine(point2, point3, scene);
        const line3 = createLine(point3, point1, scene);

        // Создаем треугольник с помощью CreateMesh
        const vertices = [
            point1.position.x, point1.position.y, point1.position.z,
            point2.position.x, point2.position.y, point2.position.z,
            point3.position.x, point3.position.y, point3.position.z
        ];

        const indices = [0, 1, 2];

        const vertexData = new BABYLON.VertexData();
        vertexData.positions = vertices;
        vertexData.indices = indices;

        const polygon = new BABYLON.Mesh("triangle", scene);
        vertexData.applyToMesh(polygon);
        polygon.convertToUnIndexedMesh();

        // Создаем материал для треугольника
        const material = new BABYLON.StandardMaterial("triangleMaterial", scene);
        material.diffuseColor = new BABYLON.Color3(0.5, 0.8, 1.0);
        material.alpha = 0.5;
        material.backFaceCulling = false;
        polygon.material = material;

        return [line1, line2, line3, polygon];
    } catch (error) {
        throw error;
    }
}

// Функция для очистки только линии
export function clearLine(currentLine) {
    if (currentLine) {
        currentLine.dispose();
        return null;
    }
    return currentLine;
}

// Функция для очистки только треугольника
export function clearTriangle(currentTriangle) {
    if (currentTriangle) {
        currentTriangle.forEach(mesh => {
            if (mesh.material) {
                mesh.material.dispose();
            }
            mesh.dispose();
        });
        return null;
    }
    return currentTriangle;
}