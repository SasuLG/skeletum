export const os = {
  "Squelette axial": {
    "Tête": {
      "Frontal": 1,
      "Pariétal": 2,
      "Occipital": 1,
      "Temporal": 2,
      "Sphénoïde": 1,
      "Ethmoïde": 1,
      "Vomer": 1,
      "Maxillaire": 2,
      "Mandibule": 1,
      "Zygomatique": 2,
      "Nasal": 2,
      "Lacrymal": 2,
      "Palatin": 2,
      "Cornet nasal inférieur": 2,
      "Marteau": 2,
      "Enclume": 2,
      "Étrier": 2
    },
    "Tronc":{
      "Cervicales": 7,
      "Thoraciques": 12,
      "Lombaires": 5,
      "Vraies côtes": 14,
      "Fausses côtes": 6,
      "Côtes flottantes": 4,
      "Sacrum": 1,
      "Coccyx": 1,
      "Sternum": 1,
      "Hyoïde": 1
    }
  },
  "Squelette appendiculaire": {
    "Ceinture scapulaire": {
      "Clavicule": 2,
      "Scapula": 2
    },
    "Membres supérieurs": {
      "Humérus": 2,
      "Radius": 2,
      "Ulna": 2,
      "Carpe": {
        "Scaphoïde": 2,
        "Lunatum": 2,
        "Triquetrum": 2,
        "Pisiforme": 2,
        "Trapèze": 2,
        "Trapézoïde": 2,
        "Capitatum": 2,
        "Hamatum": 2
      },
      "Métacarpe": 10,
      "Phalanges Proximale": 10,
      "Phalanges Médiane": 8,
      "Phalanges Distale": 10,
    },
    "Ceinture pelvienne": {
      "Coxal": 2
    },
    "Membres inférieurs": {
      "Fémur": 2,
      "Tibia": 2,
      "Fibula": 2,
      "Patella": 2,
      "Tarse": {
        "Talus": 2,
        "Calcanéus": 2,
        "Naviculaire": 2,
        "Cuboide": 2,
        "Cunéiformes médial": 2,
        "Cunéiformes intermédiaire": 2,
        "Cunéiformes latéral": 2
      },
      "Métatarse": 10,
      "Phalanges Proximale": 10,
      "Phalanges Médiane": 8,
      "Phalanges Distale": 10,
    }
  }
}

export let mode = null; // "normal" | "hard"
let resolveMode;
export const waitForMode = new Promise(resolve => {
  resolveMode = resolve;
});
function start() {

  // Overlay principal
  const overlay = document.createElement("div");
  overlay.id = "mode-overlay";

  const box = document.createElement("div");
  box.classList.add("mode-box");

  const title = document.createElement("h1");
  title.textContent = "Choisis ton mode";

  const normalBtn = document.createElement("button");
  normalBtn.textContent = "Mode Normal";
  normalBtn.classList.add("mode-btn", "normal");

  const hardBtn = document.createElement("button");
  hardBtn.textContent = "Mode Hard";
  hardBtn.classList.add("mode-btn", "hard");

  box.appendChild(title);
  box.appendChild(normalBtn);
  box.appendChild(hardBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  function selectMode(selectedMode) {
    mode = selectedMode;
    overlay.classList.add("fade-out");

    setTimeout(() => {
      overlay.remove();
      resolveMode(mode);

    }, 500);
  }

  normalBtn.addEventListener("click", () => selectMode("normal"));
  hardBtn.addEventListener("click", () => selectMode("hard"));
}

function countTotalBones(data) {
  let total = 0;

  Object.values(data).forEach(value => {
    if (typeof value === "number") {
      total += value;
    } else {
      total += countTotalBones(value);
    }
  });

  return total;
}

export function buildBoard(data, parent) {
  Object.entries(data).forEach(([key, value]) => {

    const container = document.createElement("div");
    container.classList.add("category");

    const total = countTotalBones(value);

    const title = document.createElement("h2");
    title.textContent = `${key} (${total})`;
    container.appendChild(title);

    buildSection(value, container);

    parent.appendChild(container);
  });
}

function buildSection(data, parent) {
  Object.entries(data).forEach(([key, value]) => {

    if (typeof value === "number") {

      const bone = document.createElement("div");
      bone.classList.add("bone-slot");

      // On stocke le vrai nom pour plus tard
      bone.dataset.name = key;
      bone.dataset.count = value;

      // Affichage vide
      bone.textContent = value > 1 ? `x${value}` : "";

      parent.appendChild(bone);

    } else {

      const section = document.createElement("div");
      section.classList.add("subcategory");

      const total = countTotalBones(value);

      const title = document.createElement("h3");
      title.textContent = `${key} (${total})`;

      section.appendChild(title);

      buildSection(value, section);

      parent.appendChild(section);
    }

  });
}

// buildBoard(os, document.getElementById("board"));
start()