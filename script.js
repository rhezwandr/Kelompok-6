document.addEventListener("DOMContentLoaded", function () {
    const inputN = document.getElementById("inputN");
    const inputR = document.getElementById("inputR");
    const inputP = document.getElementById("inputP");
    const calcType = document.getElementById("calcType");
    const calculateButton = document.getElementById("calculateButton");
    const resultArea = document.getElementById("resultArea");
    const inputBit = document.getElementById("inputBit");
    const inputComplementOutcomes = document.getElementById("inputComplementOutcomes");
    const inputRContainer = document.getElementById("inputRContainer");
    const inputPContainer = document.getElementById("inputPContainer");
    const inputBitContainer = document.getElementById("inputBitContainer");
    const inputComplementOutcomesContainer = document.getElementById("inputComplementOutcomesContainer");
    const bayesInputs = document.getElementById("bayesInputs");

    calcType.addEventListener("change", function () {
        const type = calcType.value;
        inputRContainer.classList.toggle("hidden", !(type === "permutasi" || type === "kombinasi"));
        inputPContainer.classList.toggle("hidden", type !== "ev");
        inputBitContainer.classList.toggle("hidden", type !== "bit");
        inputComplementOutcomesContainer.classList.toggle("hidden", type !== "bit");
        bayesInputs.classList.toggle("hidden", type !== "Teorema Bayes");
    });

    calculateButton.addEventListener("click", calculate);

    function calculate() {
        const n = parseInt(inputN.value);
        const r = parseInt(inputR.value);
        const p = parseFloat(inputP.value);
        const type = calcType.value;
        const bit = parseInt(inputBit.value);
        const complementOutcomes = parseFloat(inputComplementOutcomes.value);
    
        if (type === "birthday") {
            if (isNaN(n) || n <= 0) {
                resultArea.textContent = "Masukan nilai n yang valid (n > 0)";
                return;
            }
            const probability = birthdayProblem(n);
            resultArea.innerHTML = `<p>Probabilitas dua orang memiliki ulang tahun yang sama di grup ${n} orang: ${(probability * 100).toFixed(2)}%</p>`;
        } else if (type === "permutasi" || type === "kombinasi") {
            if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
                resultArea.textContent = "Masukan nilai n dan r yang valid (n ≥ r ≥ 0)";
                return;
            }
    
            if (type === "permutasi") {
                const permutation = factorial(n) / factorial(n - r);
                resultArea.innerHTML = `<p>Permutasi (P): ${permutation.toLocaleString()}</p>`;
            } else if (type === "kombinasi") {
                const combination = factorial(n) / (factorial(r) * factorial(n - r));
                resultArea.innerHTML = `<p>Kombinasi (C): ${combination.toLocaleString()}</p>`;
            }
        } else if (type === "ev") {
            if (isNaN(n) || isNaN(p) || p < 0 || p > 1) {
                resultArea.textContent = "Masukan nilai n yang valid (n ≥ 0) dan probabilitas yang valid (0 ≤ P(X) ≤ 1)";
                return;
            }
            const ev = calculateEV(p, n);
            resultArea.innerHTML = `<p>Expected Value (EV): ${ev.toFixed(2)}</p>`;
        } else if (type === "bit") {
            if (isNaN(n) || isNaN(bit) || (bit !== 0 && bit !== 1) || isNaN(complementOutcomes)) {
                resultArea.textContent = "Masukkan nilai n yang valid, bit (0 atau 1), dan jumlah hasil untuk kejadian komplemen";
                return;
            }
            const totalOutcomes = Math.pow(2, n);
            const pEComplement = complementOutcomes / totalOutcomes;
            const pE = 1 - pEComplement;
            resultArea.innerHTML = `<p>Total kemungkinan hasil (|S|) = ${totalOutcomes.toFixed(0)}</p>
                                    <p>Jumlah hasil untuk kejadian komplemen (|E̅|) = ${complementOutcomes.toFixed(0)}</p>
                                    <p>Probabilitas dari kejadian komplemen (P(E̅)) = ${complementOutcomes.toFixed(0)} / ${totalOutcomes.toFixed(0)} = ${pEComplement.toFixed(4)}</p>
                                    <p>Probabilitas bahwa setidaknya ada satu bit ${bit} (P(E)) = ${(totalOutcomes - complementOutcomes).toFixed(0)} / ${totalOutcomes.toFixed(0)} = ${pE.toFixed(4)}</p>`;
        } else if (type === "Teorema Bayes") {
            const prevalence = parseFloat(document.getElementById("prevalence").value);
            const sensitivity = parseFloat(document.getElementById("sensitivity").value);
            const falsePositiveRate = parseFloat(document.getElementById("falsePositiveRate").value);
    
            if (isNaN(prevalence) || isNaN(sensitivity) || isNaN(falsePositiveRate)) {
                resultArea.textContent = "Masukkan nilai input yang valid.";
                return;
            }
    
            const pNotF = 1 - prevalence;
            const pE = (sensitivity * prevalence) + (falsePositiveRate * pNotF);
            const pFGivenE = (sensitivity * prevalence) / pE;
    
            resultArea.innerHTML = `<p>Probabilitas seseorang memiliki penyakit setelah hasil tes positif (P(F|E)): ${pFGivenE.toFixed(6)}</p>`;
        }
    }
    
        function factorial(num) {
            if (num < 0) return -1;
            if (num === 0) return 1;
            return num * factorial(num - 1);
        }

        function birthdayProblem(n) {
            const daysInYear = 365;
            let probability = 1;

            for (let i = 0; i < n; i++) {
                probability *= (daysInYear - i) / daysInYear;
            }

            return 1 - probability;
        }

        function calculateEV(probability, n) {
            return probability * n;
        }

        function monteCarloPi(iterations) {
            let insideCircle = 0;
            let totalPoints = iterations;

            for (let i = 0; i < iterations; i++) {
                const x = Math.random() * 2 - 1; 
                const y = Math.random() * 2 - 1; 
                if (x * x + y * y <= 1) {
                    insideCircle++;
                }
            }

            let piEstimate = 4.0 * insideCircle / totalPoints;
            return piEstimate;
        }

        document.getElementById('calculateButton').addEventListener('click', calculate);

        document.getElementById('calculatePiButton').addEventListener('click', () => {
            const iterations = parseInt(document.getElementById('iterations').value);
        
            if (isNaN(iterations) || iterations <= 0) {
                alert('Masukkan jumlah iterasi yang valid (> 0).');
                return;
            }
        
            const piEstimate = monteCarloPi(iterations);
            document.getElementById('piResult').innerText = `Estimasi nilai Pi: ${piEstimate}`;
        });
    });
