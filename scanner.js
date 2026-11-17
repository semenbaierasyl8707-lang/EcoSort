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
    let currentResult = null;

    const MODEL_URL = "models/model.json";
    const METADATA_URL = "models/metadata.json";

    const wasteInfo = {
        Plastic: {
            name: {
                kk: "Пластик",
                ru: "Пластик",
                en: "Plastic"
            },
            description: {
                kk: "Бұл зат пластик қалдықтары санатына жатады.",
                ru: "Этот предмет относится к категории пластиковых отходов.",
                en: "This item belongs to the plastic waste category."
            },
            sorting: {
                kk: "Ыдысты босатып, шайыңыз. Қайта өңдеу белгісін және жергілікті сұрыптау ережелерін тексеріңіз.",
                ru: "Опустошите и промойте контейнер. Проверьте знак переработки и местные правила сортировки.",
                en: "Empty and rinse the container. Check the recycling symbol and local collection rules."
            },
            tip: {
                kk: "Пластик ыдыстарды қайта өңдеуге жібермес бұрын тазалап, шайыңыз.",
                ru: "Очищайте и промывайте пластиковые контейнеры перед переработкой.",
                en: "Empty and rinse plastic containers before recycling."
            }
        },

        Paper: {
            name: {
                kk: "Қағаз",
                ru: "Бумага",
                en: "Paper"
            },
            description: {
                kk: "Бұл зат қағаз қалдықтары санатына жатады.",
                ru: "Этот предмет относится к категории бумажных отходов.",
                en: "This item belongs to the paper waste category."
            },
            sorting: {
                kk: "Қағазды құрғақ әрі таза ұстаңыз. Картонды бүктеп, пластик қаптамаларды алып тастаңыз.",
                ru: "Храните бумагу сухой и чистой. Сложите картон и удалите пластиковую упаковку.",
                en: "Keep paper dry and clean. Flatten cardboard and remove plastic wrapping."
            },
            tip: {
                kk: "Қайта өңдеуге жіберер алдында қағазды таза әрі құрғақ ұстаңыз.",
                ru: "Перед переработкой убедитесь, что бумага чистая и сухая.",
                en: "Keep paper clean and dry before recycling."
            }
        },

        Glass: {
            name: {
                kk: "Шыны",
                ru: "Стекло",
                en: "Glass"
            },
            description: {
                kk: "Бұл зат шыны қалдықтары санатына жатады.",
                ru: "Этот предмет относится к категории стеклянных отходов.",
                en: "This item belongs to the glass waste category."
            },
            sorting: {
                kk: "Бөтелкелер мен банкаларды босатып, шайыңыз. Жергілікті шыны жинау ережелерін сақтаңыз.",
                ru: "Опустошите и промойте бутылки или банки. Соблюдайте местные правила сбора стекла.",
                en: "Empty and rinse bottles or jars. Follow local glass collection rules."
            },
            tip: {
                kk: "Шыны ыдыстарды қайта өңдеу үшін бөлек жинаңыз.",
                ru: "Собирайте стеклянную тару отдельно для переработки.",
                en: "Separate glass containers for recycling."
            }
        },

        Metal: {
            name: {
                kk: "Металл",
                ru: "Металл",
                en: "Metal"
            },
            description: {
                kk: "Бұл зат металл қалдықтары санатына жатады.",
                ru: "Этот предмет относится к категории металлических отходов.",
                en: "This item belongs to the metal waste category."
            },
            sorting: {
                kk: "Консерві қалбырларын босатып, қажет болса шайыңыз. Қабылданатын металл қаптамаларды бөлек жинаңыз.",
                ru: "Опустошите банки и при необходимости промойте их. Отделяйте металлическую упаковку, принимаемую на переработку.",
                en: "Empty cans and rinse them if needed. Separate accepted metal packaging."
            },
            tip: {
                kk: "Металл қалбырларды қайта өңдеуге жібермес бұрын тазалаңыз.",
                ru: "Очищайте металлические банки перед переработкой.",
                en: "Clean metal cans before recycling."
            }
        },

        Organic: {
            name: {
                kk: "Органикалық қалдық",
                ru: "Органические отходы",
                en: "Organic"
            },
            description: {
                kk: "Бұл зат органикалық қалдықтар санатына жатады.",
                ru: "Этот предмет относится к категории органических отходов.",
                en: "This item belongs to the organic waste category."
            },
            sorting: {
                kk: "Тамақ қалдықтары мен өсімдік қалдықтарын бөлек жинаңыз. Жергілікті жүйе қабылдайтын материалдарды компост жасаңыз.",
                ru: "Сортируйте пищевые и растительные отходы. Компостируйте материалы, принимаемые местной системой.",
                en: "Separate food scraps and plant waste. Compost materials accepted by your local system."
            },
            tip: {
                kk: "Тамақ қалдықтарын компост ретінде пайдалануға болады.",
                ru: "Пищевые отходы можно использовать для компостирования.",
                en: "Food scraps can be composted."
            }
        }
    };

    const interfaceText = {
        kk: {
            loading: "AI моделі жүктелуде...",
            analyzing: "AI талдап жатыр...",
            analyze: "♻ Қалдықты талдау",
            invalid: "Жарамды сурет жүктеңіз!",
            uploadFirst: "Алдымен сурет жүктеңіз!",
            error: "AI моделін жүктеу қатесі. Модель файлдарын тексеріңіз.",
            unknownDescription: "AI анықтаған материал: ",
            unknownSorting: "Материал санатын және жергілікті сұрыптау ережелерін тексеріңіз.",
            unknownTip: "Қалдық санатын тексеріңіз."
        },
        ru: {
            loading: "Загрузка AI-модели...",
            analyzing: "AI анализирует...",
            analyze: "♻ Анализировать отходы",
            invalid: "Загрузите корректное изображение!",
            uploadFirst: "Сначала загрузите изображение!",
            error: "Ошибка загрузки AI-модели. Проверьте файлы модели.",
            unknownDescription: "AI определил материал: ",
            unknownSorting: "Проверьте категорию материала и местные правила сортировки.",
            unknownTip: "Проверьте категорию отходов."
        },
        en: {
            loading: "Loading AI Model...",
            analyzing: "AI Analyzing...",
            analyze: "♻ Analyze Waste",
            invalid: "Please upload a valid image!",
            uploadFirst: "Please upload an image first!",
            error: "Error loading AI model. Please check your model files.",
            unknownDescription: "AI detected: ",
            unknownSorting: "Please check the material category and local recycling rules.",
            unknownTip: "Please check the waste category."
        }
    };

    function getLanguage() {
        const savedLanguage = localStorage.getItem("ecosort-language") || "en";
        return interfaceText[savedLanguage] ? savedLanguage : "en";
    }

    function updateResult() {
        if (!currentResult) return;

        const lang = getLanguage();
        const { wasteName, confidence } = currentResult;
        const info = wasteInfo[wasteName];

        if (info) {
            category.textContent = info.name[lang] + " ♻️";
            description.textContent = info.description[lang];
            sortingInstructions.textContent = info.sorting[lang];
            tip.textContent = info.tip[lang];
        } else {
            category.textContent = wasteName + " ♻️";
            description.textContent =
                interfaceText[lang].unknownDescription + wasteName;
            sortingInstructions.textContent =
                interfaceText[lang].unknownSorting;
            tip.textContent = interfaceText[lang].unknownTip;
        }

        confidenceValue.textContent = confidence + "%";
        confidenceBar.style.width = confidence + "%";
    }

    async function loadModel() {
        if (!model) {
            analyzeButton.textContent = interfaceText[getLanguage()].loading;
            model = await tmImage.load(MODEL_URL, METADATA_URL);
        }
    }

    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert(interfaceText[getLanguage()].invalid);
            return;
        }

        selectedImage = file;

        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";

        analyzeButton.disabled = false;
        resultBox.style.display = "none";
        currentResult = null;
    });

    analyzeButton.addEventListener("click", async () => {
        if (!selectedImage) {
            alert(interfaceText[getLanguage()].uploadFirst);
            return;
        }

        try {
            analyzeButton.disabled = true;
            analyzeButton.textContent = interfaceText[getLanguage()].analyzing;

            await loadModel();

            const predictions = await model.predict(preview);

            predictions.sort((a, b) => b.probability - a.probability);

            const bestResult = predictions[0];

            const wasteName = bestResult.className.trim();
            const confidence = (bestResult.probability * 100).toFixed(1);

            currentResult = {
                wasteName,
                confidence
            };

            updateResult();

            resultBox.style.display = "block";

        } catch (error) {
            console.error("AI Error:", error);
            alert(interfaceText[getLanguage()].error);
        } finally {
            analyzeButton.disabled = false;
            analyzeButton.textContent = interfaceText[getLanguage()].analyze;
        }
    });

    // Update AI result when language changes
    const languageSelect = document.getElementById("languageSelect");

    if (languageSelect) {
    languageSelect.addEventListener("change", () => {
        updateResult();

        const lang = getLanguage();

        analyzeButton.textContent = interfaceText[lang].analyze;

        const headings = document.querySelectorAll(".result-information h3");

        if (headings[0]) {
            headings[0].textContent = {
                kk: "📋 Материал туралы",
                ru: "📋 О материале",
                en: "📋 About This Material"
            }[lang];
        }

        if (headings[1]) {
            headings[1].textContent = {
                kk: "♻️ Сұрыптау нұсқаулығы",
                ru: "♻️ Инструкция по сортировке",
                en: "♻️ Sorting Instructions"
            }[lang];
        }
    });
}
});