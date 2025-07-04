<script setup>
// 导入threejs
import * as THREE from "three";
// 导入轨道控制器 也就是可以拖动和缩放的能力
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import jpg1 from "./assets/texture/watercover/CityNewYork002_COL_VAR1_1K.png";
import jpg2 from "./assets/texture/watercover/CityNewYork002_AO_1K.jpg";
import alphaJpg from "./assets/texture/door/height.jpg";
import lightJpg from "./assets/texture/colors.png";
import hdr from "./assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr";
import gaoguangJpg from "./assets/texture/watercover/CityNewYork002_GLOSS_1K.jpg";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 创建场景
const scene = new THREE.Scene();

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
// 纹理加载器
let textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load(jpg1);
//改成人眼的srgb格式对光强感知更好
texture.colorSpace = THREE.SRGBColorSpace;
// 加载ao贴图
let aoMap = textureLoader.load(jpg2);
// 透明贴图
let alphaMap = textureLoader.load(alphaJpg);
// 光照贴图
let lightMap = textureLoader.load(lightJpg);
// 高光贴图
let specularMap = textureLoader.load(gaoguangJpg);
// rgbeLoader 加载hdr贴图
let rgbLoader = new RGBELoader();
rgbLoader.load(hdr, (envMap) => {
  // 设置球星贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图
  scene.background = envMap;
  // 场景设置环境贴图
  scene.environment = envMap;
  // 设置plane的环境贴图
  planeMaterial.envMap = envMap;
});
let planeGeometry = new THREE.PlaneGeometry(1, 1);
let planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  // map: texture,
  // 设置透明度
  transparent: true,
  // 设置ao贴图
  aoMap: aoMap,
  // 透明度贴图
  // alphaMap: alphaMap,
  aoMapIntensity: 1,
  // lightMap: lightMap,
  specularMap: specularMap,
  // 反射强度
  reflectivity: 0.5,
});
planeMaterial.map = texture;
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
const gui = new GUI();
gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("ao贴图");
gui
  .add(texture, "colorSpace", {
    sRGB: THREE.SRGBColorSpace,
    Linear: THREE.LinearSRGBColorSpace,
  })
  .onChange(() => {
    texture.needsUpdate = true;
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
