document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const preview = document.getElementById("preview");
    const analyzeButton = document.getElementById("analyzeButton");

    const resultBox = document.getElementById("resultBox");
    const category = document.getElementById("category");
    const description = document.getElementById("description");
    const sortingInstructions = document.getElementById("sortingInstructions");
    const tip = document.getElementById("tip");

    const confidenceValue = document.getElementById("confidenceValue");
    const confidenceBar = document.getElementById("confidenceBar");

    let selectedImage = null;
    let model = null;

    const MODEL_URL = "models/model.json";
    const METADATA_URL = "models/metadata.json";

    const wasteInfo = {
        Plastic: {
            description: "This item belongs to the plastic waste category.",
            sorting: "Empty and rinse the container. Check the recycling symbol and local collection rules.",
            tip: "Empty and rinse plastic containers before recycling."
        },
        Paper: {
            description: "This item belongs to the paper waste category.",
            sorting: "Keep paper dry and clean. Flatten cardboard and remove plastic wrapping.",
            tip: "Keep paper clean and dry before recycling."
        },
        Glass: {
            description: "This item belongs to the glass waste category.",
            sorting: "Empty and rinse bottles or jars. Follow local glass collection rules.",
            tip: "Separate glass containers for recycling."
        },
        Metal: {
            description: "This item belongs to the metal waste category.",
            sorting: "Empty cans and rinse them if needed. Separate accepted metal packaging.",
            tip: "Clean metal cans before recycling."
        },
        Organic: {
            description: "This item belongs to the organic waste category.",
            sorting: "Separate food scraps and plant waste. Compost materials accepted by your local system.",
            tip: "Food scraps can be composted."
        }
    };

    // Load AI model
    async function loadModel() {
        if (!model) {
            analyzeButton.textContent = "Loading AI Model...";
            model = await tmImage.load(MODEL_URL, METADATA_URL);
        }
    }

    // Upload image
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image!");
            return;
        }

        selectedImage = file;

        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";

        analyzeButton.disabled = false;
        resultBox.style.display = "none";
    });

    // AI image analysis
    analyzeButton.addEventListener("click", async () => {
        if (!selectedImage) {
            alert("Please upload an image first!");
            return;
        }

        try {
            analyzeButton.disabled = true;
            analyzeButton.textContent = "AI Analyzing...";

            await loadModel();

            const predictions = await model.predict(preview);

            predictions.sort((a, b) => b.probability - a.probability);

            const bestResult = predictions[0];

            const wasteName = bestResult.className.trim();
            const confidence = (bestResult.probability * 100).toFixed(1);

            const info = wasteInfo[wasteName];

            category.textContent = wasteName + " ♻️";

            confidenceValue.textContent = confidence + "%";
            confidenceBar.style.width = confidence + "%";

            if (info) {
                description.textContent = info.description;
                sortingInstructions.textContent = info.sorting;
                tip.textContent = info.tip;
            } else {
                description.textContent = "AI detected: " + wasteName;
                sortingInstructions.textContent = "Please check the material category and local recycling rules.";
                tip.textContent = "Please check the waste category.";
            }

            resultBox.style.display = "block";

        } catch (error) {
            console.error("AI Error:", error);
            alert("Error loading AI model. Please check your model files.");
        } finally {
            analyzeButton.disabled = false;
            analyzeButton.textContent = "♻ Analyze Waste";
        }
    });
});