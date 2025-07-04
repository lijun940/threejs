<script setup>
// 导入threejs
import * as THREE from "three";
// 导入轨道控制器 也就是可以拖动和缩放的能力
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Duck from "./assets/model/Duck.glb";
import City from "./assets/model/city.glb";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import hdr from "./assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr";
// 导入draco解析器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);
// 创建相机 透视相机 近大远小
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远屏幕
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
// 看到拖动和缩放 物体发生视觉上的变化是因为监听了浏览器canvas事件,控制相机绕着
const controls = new OrbitControls(camera, renderer.domElement);
// 如果canvas被挡住了，换一个对象监听 但是小心控制器事件和点击事件互相影响
// const controls = new OrbitControls(camera, document.body);

// 带阻尼
controls.enableDamping = true;
// 阻尼系数
controls.dampingFactor = 0.05;

// 渲染
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
// 监听窗口的变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 充值相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});
// GLTF是最常用的3d模型格式 GLTF表示json数据的模型数据，GLB 已经转成二进制的模型数据
const gui = new GUI();

// 城市模型被压缩 需要draco库解压缩
// 加载环境贴图
let rgbeLoader = new RGBELoader();

let rgbLoader = new RGBELoader();
rgbLoader.load(hdr, (envMap) => {
  // 设置球星贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图
  scene.background = envMap;
  // 场景设置环境贴图
  scene.environment = envMap;
  // 设置plane的环境贴图
});
// 实例化加载器draco
const dracoLoader = new DRACOLoader();
// 设置draco路径
dracoLoader.setDecoderPath("./draco/");
// 实例化加载器
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
// 加载模型
gltfLoader.load(Duck, (gltf) => {
  // 模型加载完成
  scene.add(gltf.scene);
  let duckMesh = gltf.scene.getObjectByName("LOD3spShape");
  let duckGeometry = duckMesh.geometry;
  // 计算包围盒
  duckGeometry.computeBoundingBox();
  // 设置几何体居中
  duckGeometry.center();
  // 获取duck包围盒
  let duckBox = duckGeometry.boundingBox;
  // 更新世界矩阵
  duckMesh.updateWorldMatrix(true, true);
  // 更新包围盒
  duckBox.applyMatrix4(duckMesh.matrixWorld);
  // 获取包围盒中心点
  let center = duckBox.getCenter(new THREE.Vector3());
  console.log(center);
  // 创建包围盒辅助器
  let boxHelper = new THREE.Box3Helper(duckBox, 0xff0000);
  scene.add(boxHelper);
  // 获取包围球
  let duckSphere = duckGeometry.boundingSphere;
  // 更新世界矩阵
  duckSphere.applyMatrix4(duckMesh.matrixWorld);
  // 创建包围球辅助器
  let sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16);
  let sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.copy(duckSphere.center);
  scene.add(sphereMesh);
});
</script>

<template></template>

<style scoped>
.btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  &.exit {
    left: 100px;
  }
}
</style>
