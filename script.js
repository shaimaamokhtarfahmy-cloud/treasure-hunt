<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رحلة غوص متون التجويد - متن الجزرية</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            user-select: none;
            background-color: #001f3f;
        }

        #game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* خلفية البحر التي تتغير ألوانها عند الغوص */
        #ocean-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, #87CEEB 0%, #1E90FF 20%, #00008B 80%, #000033 100%);
            background-size: 100% 400%;
            background-position: 0% 0%;
            transition: background-position 1.5s ease-in-out;
            z-index: -1;
        }

        #hud {
            position: absolute;
            top: 20px;
            display: flex;
            gap: 15px;
            align-items: center;
            background: rgba(255, 255, 255, 0.95);
            padding: 10px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 10;
            flex-wrap: wrap;
            justify-content: center;
        }

        .control-box { display: flex; gap: 10px; font-weight: bold; align-items: center; color: #001f3f; }

        .depth-meter {
            font-weight: bold; font-size: 18px; color: #001f3f;
            border-right: 2px solid #ccc; padding-right: 15px; margin-right: 5px;
        }

        button {
            padding: 10px 20px; cursor: pointer; background-color: #ff851b;
            color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 16px;
            transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }
        button:hover:not(:disabled) { background-color: #ff6600; transform: translateY(-2px); }
        button:disabled { background-color: #aaa; cursor: not-allowed; }

        /* الغواصة وحركتها */
        #submarine-container {
            position: absolute;
            top: 25%;
            transition: top 1.2s ease-in-out;
        }

        #submarine {
            font-size: 100px;
            filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));
            animation: bobbing 3s ease-in-out infinite;
            display: inline-block;
        }

        .dive-anim { animation: diveDown 1.2s ease-in-out !important; }

        @keyframes bobbing {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-2deg); }
        }

        @keyframes diveDown {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(30px) rotate(-15deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }

        #feedback-message {
            position: absolute; top: 40%; font-size: 35px; font-weight: bold;
            color: #ffdc00; text-shadow: 2px 2px 5px rgba(0,0,0,0.8);
            z-index: 20; display: none;
        }
        .show-feedback { display: block !important; animation: popIn 1.5s ease-out forwards; }

        @keyframes popIn {
            0% { opacity: 0; transform: scale(0.5); }
            20% { opacity: 1; transform: scale(1.2); }
            80% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
        }

        /* المربع الحواري */
        .hidden { display: none !important; }
        #quiz-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 30, 0.85); display: flex; justify-content: center; align-items: center; z-index: 100;
        }
        .modal-content {
            background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 500px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8); text-align: center;
        }
        .lesson-box { 
            background: #f0f8ff; padding: 15px; border-radius: 8px; 
            border-right: 5px solid #0074d9; margin-bottom: 20px; text-align: right;
        }
        #lesson-text { font-size: 18px; line-height: 1.6; font-weight: bold; color: #001f3f;}
        .badge { background: #39cccc; color: #001f3f; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 13px; display: inline-block; margin-bottom: 10px;}
        #options { display: flex; flex-direction: column; gap: 10px; margin-top: 20px;}
        .opt-btn { 
            background-color: #0074d9; color: white; border: none; padding: 12px; 
            border-radius: 8px; font-size: 16px; cursor: pointer; transition: 0.2s; font-weight: bold;
        }
        .opt-btn:hover { background-color: #0056b3; }

        /* تجاوب مع الهواتف الذكية */
        @media (max-width: 600px) {
            #submarine { font-size: 65px; }
            #hud { top: 10px; padding: 8px 12px; gap: 8px; }
            .depth-meter { font-size: 14px; padding-right: 8px; }
            .modal-content { padding: 20px; }
            #lesson-text { font-size: 16px; }
        }
    </style>
</head>
<body>

<div id="game-container">
    <div id="ocean-bg"></div>

    <div id="hud">
        <div class="control-box">
            <span>رحلة غوص: </span>
            <span id="level-title">متن الجزرية</span>
        </div>
        <div class="depth-meter">العمق: <span id="depth-val">0</span> متر</div>
        <button id="dive-btn" onclick="openQuiz()">ابدأ الغوص 🤿</button>
    </div>

    <div id="submarine-container">
        <div id="submarine">🥽 submarine 🚢</div>
    </div>

    <div id="feedback-message">إجابة صحيحة! 👏</div>

    <!-- نافذة الأسئلة -->
    <div id="quiz-modal" class="hidden">
        <div class="modal-content">
            <span class="badge" id="category-badge">باب المخارج</span>
            <div class="lesson-box">
                <p id="lesson-text">بيت الشعر هنا...</p>
            </div>
            <h3 id="question-text" style="color: #001f3f;">السؤال يعرض هنا؟</h3>
            <div id="options">
                <!-- الأزرار تولد بالـ JavaScript -->
            </div>
        </div>
    </div>
</div>

<script>
    // بنية الأسئلة الخاصة بمتن الجزرية
    const جزري_questions = [
        {
            category: "المقدمة",
            verse: "مَخَارِجُ الحُرُوفِ سَبْعَةَ عَشَرْ *** عَلَى الَّذِي يَخْتَارُهُ مَنِ اخْتَبَرْ",
            question: "كم عدد مخارج الحروف عند الإمام ابن الجزري؟",
            options: ["14 مخرجاً", "17 مخرجاً", "15 مخرجاً"],
            correct: 1,
            depth: 100
        },
        {
            category: "مخارج الحروف",
            verse: "فَأَلِفُ الجَوْفِ وَأُخْتَاهَا وَهِي *** حُرُوفُ مَدٍّ لِلْهَوَاءِ تَنْتَهِي",
            question: "ما هي الحروف التي تخرج من الجوف؟",
            options: ["حروف القلقلة", "حروف المد الثلاثة", "حروف الحلق"],
            correct: 1,
            depth: 250
        },
        {
            category: "صفات الحروف",
            verse: "صَفِيرُهَا صَادٌ وَزَايٌ سِينُ *** قَلْقَلَةٌ قُطْبُ جَدٍّ وَاللِّينُ",
            question: "ما هي حروف القلقلة المجموعة في المتن؟",
            options: ["خص ضغط قظ", "قطب جد", "يرملون"],
            correct: 1,
            depth: 400
        },
        {
            category: "التجويد والترقيق",
            verse: "وَرَقِّقَنَّ مُسْتَفِلاً مِنْ أَحْرُفِ *** وَحَاذِرَنْ تَفْخِيمَ لَفْظِ الأَلِفِ",
            question: "ما الحكم الأساسي لحروف الاستفال؟",
            options: ["التفخيم دائماً", "الترقيق", "الإدغام"],
            correct: 1,
            depth: 600
        },
        {
            category: "أحكام النون الساكنة والتنوين",
            verse: "وَأَظْهِرَنْ عِنْدَ حُرُوفِ الحَلْقِ *** ثَامِنُهَا الإِدْغَامُ بِغَيْرِ غُنَّهْ",
            question: "كم عدد أركان وأحكام النون الساكنة والتنوين الرئيسية؟",
            options: ["3 أحكام", "4 أحكام (الإظهار، الإدغام، الإقلاب، الإخفاء)", "5 أحكام"],
            correct: 1,
            depth: 850
        }
    ];

    let currentQuestionIndex = 0;
    let currentDepth = 0;

    function openQuiz() {
        if (currentQuestionIndex >= جزري_questions.length) {
            alert("ما شاء الله! أتممت الغوص في أعماق متن الجزرية بنجاح! 🎉");
            resetGame();
            return;
        }

        const q = جزري_questions[currentQuestionIndex];
        document.getElementById('category-badge').innerText = q.category;
        document.getElementById('lesson-text').innerText = "﴿ " + q.verse + " ﴾";
        document.getElementById('question-text').innerText = q.question;

        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(btn);
        });

        document.getElementById('quiz-modal').classList.remove('hidden');
    }

    function checkAnswer(selectedIndex) {
        const q = جزري_questions[currentQuestionIndex];
        const modal = document.getElementById('quiz-modal');
        modal.classList.add('hidden');

        if (selectedIndex === q.correct) {
            // إجابة صحيحة
            showFeedback("إجابة صحيحة! أحسنت 👏");
            diveSubmarine(q.depth);
            currentQuestionIndex++;
        } else {
            // إجابة خاطئة
            showFeedback("إجابة خاطئة! حاول مرة أخرى ❌");
        }
    }

    function diveSubmarine(newDepth) {
        currentDepth = newDepth;
        document.getElementById('depth-val').innerText = currentDepth;

        // تحريك خلفية البحر
        const bgProgress = (currentQuestionIndex + 1) * 20; 
        document.getElementById('ocean-bg').style.backgroundPosition = `0% ${bgProgress}%`;

        // إضافة حركة الغوص للغواصة
        const subContainer = document.getElementById('submarine-container');
        const sub = document.getElementById('submarine');
        
        sub.classList.add('dive-anim');
        subContainer.style.top = `${25 + (currentQuestionIndex + 1) * 10}%`;

        setTimeout(() => {
            sub.classList.remove('dive-anim');
        }, 1200);
    }

    function showFeedback(msg) {
        const fb = document.getElementById('feedback-message');
        fb.innerText = msg;
        fb.classList.add('show-feedback');
        setTimeout(() => {
            fb.classList.remove('show-feedback');
        }, 1500);
    }

    function resetGame() {
        currentQuestionIndex = 0;
        currentDepth = 0;
        document.getElementById('depth-val').innerText = "0";
        document.getElementById('ocean-bg').style.backgroundPosition = '0% 0%';
        document.getElementById('submarine-container').style.top = '25%';
    }
</script>

</body>
</html>
