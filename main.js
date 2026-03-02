import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import { mode, waitForMode, os, buildBoard } from "./build.js";
await waitForMode;
buildBoard(os, document.getElementById("board"));

//#region DOM


let ended = false;
const toggleBtn = document.getElementById("toggle-board");
const sidePanel = document.getElementById("side-panel");
const timerElement = document.getElementById("timer");
const answerElement = document.getElementById("answer");
const bones = document.querySelectorAll(".bone-slot");
const totalOsElement = document.getElementById("totalOs");
let totalOsFind = 0;


if(mode === "normal") sidePanel.classList.toggle("open");
toggleBtn.addEventListener("click", () => {
  sidePanel.classList.toggle("open");
});

let timer = 0;
setInterval(() => {
  if(ended) return;
  timer++;
  timerElement.textContent = timer + " s";
}, 1000);

//#region pas cool
let j = 0;
setInterval(() => {
  j = 0;
}, 1000);

window.addEventListener("keydown", (e) => {
  if(e.key === "l"){
    j++;
    if(j===6){
      ended = true;
      gltf.scene.children.forEach(c => {
        if(c.geometry){
          scene.add(new THREE.Mesh(c.geometry, material));
        }
        else{
          c.children.forEach(child => {
            if(child.geometry){
              scene.add(new THREE.Mesh(child.geometry, material));
            }
          });
        }
      });
      bones.forEach(bone => {
        bone.classList.add("found");
        bone.innerHTML = "";
        totalOsFind += parseInt(bone.dataset.count);
        totalOsElement.textContent =totalOsFind+"/206";
        const nameSpan = document.createElement("span");
        nameSpan.textContent = bone.dataset.name;
        const countSpan = document.createElement("span");
        if (bone.dataset.count > 1) {
          countSpan.textContent = `x${bone.dataset.count}`;
        }
        bone.appendChild(nameSpan);
        bone.appendChild(countSpan);
        });
      showVictoryScreen();
    }
  }
});
//#endregion pas cool


//#endregion DOM


//#region function

const noPluralStrip = ["cubitus", "radius", "humerus", "talus", "calcaneus"];
function normalize(str) {
  let normalized = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  if (normalized.endsWith("aux")) {
    normalized = normalized.replace(/aux$/, "al");
  }
  if (!noPluralStrip.includes(normalized)) {
    normalized = normalized.replace(/s$/, "");
  }
  return normalized;
}

const synonyms = {
  lunatum: ["Semi-lunaire", "lunaire"],
  ulna: ["cubitus"],
  fibula: ["péroné"],
  scapula: ["omoplate"],
  patella: ["rotule"],
  capitatum: ["Grand os"],
  hamatum: ["Os crochu"],
  
  "phalanges distale": ["phalange distale", "distale"],
  "phalanges mediane": ["phalange mediane", "mediane"],
  "phalanges proximale": ["phalange proximale", "proximale"],
  "cuneiformes medial": ["cunéiforme médial", "medial"],
  "cuneiformes intermediaire": ["cunéiforme intermédiaire", "intermediaire"],
  "cuneiformes lateral": ["cunéiforme latéral", "lateral"],
  "cervicale": ["vertèbres cervicales", "cervicales"],
  "thoracique": ["vertèbres thoraciques", "thoraciques"],
  "lombaire": ["vertèbres lombaires", "lombaires"],

  "fausse cote": ["fausses cote", "fausse cotes", "fausses cotes"],
  "vraie cote": ["vraies cote", "vraie cotes", "vraies cotes"],
  "cote flottante": ["cotes flottantes", "cote flottantes", "cotes flottante"],
};

function isCorrectAnswer(input, boneName) {
  const normalizedInput = normalize(input);
  const normalizedBone = normalize(boneName);

  if (normalizedInput === normalizedBone) return true;

  if (synonyms[normalizedBone]) {
    return synonyms[normalizedBone]
      .map(s => normalize(s))
      .includes(normalizedInput);
  }

  return false;
}

function showVictoryScreen() {

  const overlay = document.createElement("div");
  overlay.id = "victory-overlay";
  overlay.innerHTML = `
    <div class="victory-content">
      <h1>🦴 206 / 206</h1>
      <h2>ANATOMIE MAÎTRISÉE</h2>
      <p>Cliquez pour continuer</p>
    </div>
  `;
  overlay.addEventListener("click", () => {
    overlay.classList.add("fade-out");

    setTimeout(() => {
      overlay.remove();
    }, 600);
  });

  document.body.appendChild(overlay);
}

answerElement.addEventListener("input", (e) => {
  if(mode === "hard") {hardLoop();return}
  const input = answerElement.value;
  bones.forEach(bone => {
    if (bone.classList.contains("found")) return;
    if (isCorrectAnswer(input, bone.dataset.name)) {
      bone.classList.add("found");
      bone.innerHTML = "";
      totalOsFind += parseInt(bone.dataset.count);
      totalOsElement.textContent =totalOsFind+"/206";
      const nameSpan = document.createElement("span");
      nameSpan.textContent = bone.dataset.name;
      const countSpan = document.createElement("span");
      if (bone.dataset.count > 1) {
        countSpan.textContent = `x${bone.dataset.count}`;
      }
      bone.appendChild(nameSpan);
      bone.appendChild(countSpan);
      answerElement.value = "";
      const formattedName = normalize(bone.dataset.name).replace(/\s+/g, "_");
      const child = gltf.scene.children.find(c => c.name === formattedName);
      if(child && child.geometry) scene.add(new THREE.Mesh(child.geometry, material));
      else {
        const carpeSection = bone.closest(".subcategory");
        if (carpeSection) {
          const title = carpeSection.querySelector("h3");
          if (title && title.textContent.includes("Carpe")) {
            const allCarpeBones = carpeSection.querySelectorAll(".bone-slot");
            const allFound = [...allCarpeBones].every(b => b.classList.contains("found"));
            if (allFound) {
              const carpeModel = gltf.scene.children.find(c => c.name === "carpe");
              if (carpeModel && carpeModel.geometry) scene.add(new THREE.Mesh(carpeModel.geometry, material));
            }
          }
        }
      }

      if(totalOsFind == 206){
        ended = true;
        const finalChild = gltf.scene.children.find(c => c.name === "sub01");
        scene.add(new THREE.Mesh(finalChild.children[0].geometry, material));
        scene.add(new THREE.Mesh(finalChild.children[1].geometry, material));
        scene.add(new THREE.Mesh(finalChild.children[2].geometry, material));
        showVictoryScreen();
      }
    }
  });
});

//#endregion function

//#region threejs
const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(5)); 
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 50, 100);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const loader = new GLTFLoader();
const gltf = await loader.loadAsync('/skeleton.glb');
const geometry = gltf.scene.children[0].geometry;
// const texture =  new THREE.TextureLoader().load('skeleton.png');
const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
const mesh = new THREE.Mesh(geometry, material);
scene.add(gltf.scene);

//#endregion threejs


let i = 1;
function animate() {
  requestAnimationFrame(animate);

  if (i < 26) {
    camera.position.y -= 1;
    camera.position.z -= 2;
    camera.position.x += 2;
    i++;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//#region hard

//TODO  zoom
let currentOs = null;
let currentOsMesh = null;
const listOsNotVisible = ["scaphoide", "lunatum", "triquetrum", "pisiforme", "trapeze", "trapezoide", "capitatum", "hamatum", "hyoide", "palatin", "etrier", "marteau", "enclume", "cornet nasal inferieur", "lacrymal", "ethmoide"];
if(mode === "hard"){
  bones.forEach(bone => {
    if(listOsNotVisible.includes(normalize(bone.dataset.name))){
      bone.classList.add("found");  
      bone.innerHTML = "";
      totalOsFind += parseInt(bone.dataset.count);
      totalOsElement.textContent =totalOsFind+"/206";
      const nameSpan = document.createElement("span");
      nameSpan.textContent = bone.dataset.name;
      const countSpan = document.createElement("span");
      if (bone.dataset.count > 1) {
        countSpan.textContent = `x${bone.dataset.count}`;
      }
      bone.appendChild(nameSpan);
      bone.appendChild(countSpan);
    }
  });
  
  displayCurrentOs();
}

function displayCurrentOs(){
  let attempts = 0;
  do {
    currentOs = bones[Math.floor(Math.random() * bones.length)];
    attempts++;
    if (attempts > 100) break;
  } while (currentOs.classList.contains("found"));
  gltf.scene.children.forEach(c => {
    if(c.name === "sub01"){
      c.children.forEach(child => {
        if(child.geometry){
          child.visible = false;
        }
      });
    }
    if(normalize(c.name) !== normalize(currentOs.dataset.name).replace(/\s+/g, "_")){c.visible = false;}
    else{
      currentOsMesh = new THREE.Mesh(c.geometry, material);
      scene.add(currentOsMesh);
      
      c.geometry.computeBoundingBox();
      const box = c.geometry.boundingBox;
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let distance = maxDim / (2 * Math.tan(fov / 2));
      distance *= 1.5;
      camera.position.set(center.x, center.y, center.z + distance);
      camera.lookAt(center);
      controls.target.copy(center);
      controls.update();
    }
  });
  console.log(currentOs.dataset.name);
}

function hardLoop(){
  if(ended) return;
  if(isCorrectAnswer(answerElement.value, currentOs.dataset.name)){
    currentOs.classList.add("found");
    currentOs.innerHTML = "";
    totalOsFind += parseInt(currentOs.dataset.count);
    totalOsElement.textContent =totalOsFind+"/206";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = currentOs.dataset.name;
    const countSpan = document.createElement("span");
    if (currentOs.dataset.count > 1) {
      countSpan.textContent = `x${currentOs.dataset.count}`;
    }
    currentOs.appendChild(nameSpan);
    currentOs.appendChild(countSpan);
    answerElement.value = "";

    scene.remove(currentOsMesh);
    currentOsMesh.geometry.dispose();
    currentOsMesh = null;

    if(totalOsFind == 206){
      ended = true;
      gltf.scene.children.forEach(c => {
        if(c.geometry){
          scene.add(new THREE.Mesh(c.geometry, material));
        }
        else{
          c.children.forEach(child => {
            if(child.geometry){
              scene.add(new THREE.Mesh(child.geometry, material));
            }
          });
        }
      });
      showVictoryScreen();
    }

    displayCurrentOs();
  }
}

//#endregion hard