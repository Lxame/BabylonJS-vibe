// Функция для создания координатных осей
export function createAxes(scene) {
    const axisLength = 1;

    // Создаем оси
    const xAxis = BABYLON.MeshBuilder.CreateLines("xAxis", {
        points: [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(axisLength, 0, 0)
        ],
        colors: [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 1)]
    }, scene);

    const yAxis = BABYLON.MeshBuilder.CreateLines("yAxis", {
        points: [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, axisLength, 0)
        ],
        colors: [new BABYLON.Color4(0, 1, 0, 1), new BABYLON.Color4(0, 1, 0, 1)]
    }, scene);

    const zAxis = BABYLON.MeshBuilder.CreateLines("zAxis", {
        points: [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, 0, axisLength)
        ],
        colors: [new BABYLON.Color4(0, 0, 1, 1), new BABYLON.Color4(0, 0, 1, 1)]
    }, scene);
}