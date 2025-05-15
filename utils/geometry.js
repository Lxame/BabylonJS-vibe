import { debugLog } from "./debug.js";

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
export function createTriangle(point1, point2, point3, scene, isExpanded = false) {
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
        if(isExpanded) {
            material.diffuseColor = new BABYLON.Color3.Purple();
        }
        else {
            material.diffuseColor = new BABYLON.Color3(0.5, 0.8, 1.0);
        }
        material.alpha = 0.5;
        material.backFaceCulling = false;
        polygon.material = material;

        return [line1, line2, line3, polygon];
    } catch (error) {
        debugLog(`CREAT TRIAG ERR IS ${error.stack}`)
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

// Функция для проверки пересечения прямой и плоскости
export function checkLinePlaneIntersection(linePoint1, linePoint2, planePoint1, planePoint2, planePoint3) {
    // Находим направляющий вектор прямой
    const lineDirection = linePoint2.subtract(linePoint1);
    
    // Находим два вектора, лежащих в плоскости
    const planeVector1 = planePoint2.subtract(planePoint1);
    const planeVector2 = planePoint3.subtract(planePoint1);
    
    // Находим нормаль к плоскости через векторное произведение
    const planeNormal = BABYLON.Vector3.Cross(planeVector1, planeVector2);
    
    // Проверяем, параллельна ли прямая плоскости
    const dotProduct = BABYLON.Vector3.Dot(lineDirection, planeNormal);
    
    // Проверяем, лежит ли прямая в плоскости
    const distance = BABYLON.Vector3.Dot(planePoint1.subtract(linePoint1), planeNormal);
    
    if (Math.abs(dotProduct) < 0.0001) {
        if (Math.abs(distance) < 0.0001) {
            return {
                type: 'in_plane',
                message: 'Прямая лежит в плоскости',
                point: null
            };
        } else {
            return {
                type: 'parallel',
                message: 'Прямая параллельна плоскости',
                point: null
            };
        }
    }
    
    // Находим параметр t для точки пересечения
    const t = distance / dotProduct;
    
    // Находим точку пересечения
    const intersectionPoint = linePoint1.add(lineDirection.scale(t));
    
    // Проверяем, лежит ли точка пересечения внутри треугольника
    const v0 = planePoint3.subtract(planePoint1);
    const v1 = planePoint2.subtract(planePoint1);
    const v2 = intersectionPoint.subtract(planePoint1);
    
    const dot00 = BABYLON.Vector3.Dot(v0, v0);
    const dot01 = BABYLON.Vector3.Dot(v0, v1);
    const dot02 = BABYLON.Vector3.Dot(v0, v2);
    const dot11 = BABYLON.Vector3.Dot(v1, v1);
    const dot12 = BABYLON.Vector3.Dot(v1, v2);
    
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    
    // Проверяем, лежит ли точка внутри треугольника
    if (u >= 0 && v >= 0 && u + v <= 1) {
        return {
            type: 'intersects',
            message: 'Прямая пересекает плоскость внутри треугольника',
            point: intersectionPoint
        };
    } else {
        return {
            type: 'intersects_outside',
            message: 'Прямая пересекает плоскость вне треугольника',
            point: intersectionPoint
        };
    }
}

export function distanceP2P(point1, point2) {
    try {    
        return Math.sqrt(Math.pow(point1.position.x - point2.position.x, 2)
                       + Math.pow(point1.position.y - point2.position.y, 2)
                       + Math.pow(point1.position.z - point2.position.z, 2)); 
    } catch (error) {
        debugLog(error);
    }
}