function openClassPage(classNumber) {
    window.location.href = `notes.html?class=${classNumber}`;
}

function openClassSubject(classNumber, subject) {
    const subjectName = String(subject || "").toLowerCase();
    const validSubjects = ["physics", "maths", "chemistry"];
    const safeSubject = validSubjects.includes(subjectName) ? subjectName : "physics";
    window.location.href = `notes.html?class=${classNumber}&subject=${safeSubject}`;
}

function openParentView() {
    window.location.href = "parent.html";
}

function startExamMode() {
    const params = new URLSearchParams(window.location.search);
    if (!params.get("class")) {
        return;
    }
    params.set("quiz", "1");
    params.set("exam", "1");
    params.delete("daily");
    window.location.href = `notes.html?${params.toString()}`;
}

// Notes page helpers: read ?class= and ?subject= params, update title and show subject content
function parseQueryParams() {
    try {
        const params = new URLSearchParams(window.location.search);
        const cls = params.get('class');
        const subject = params.get('subject');
        return { classNumber: cls ? Number(cls) : null, subject };
    } catch (e) {
        return { classNumber: null, subject: null };
    }
}

function initNotesPage() {
    if (!document.body || !document.body.classList.contains('notes-page')) return;
    const params = parseQueryParams();
    const cls = params.classNumber || null;
    const titleEl = document.getElementById('page-title');
    const notesQuote = document.getElementById('notes-quote');
    if (titleEl && cls) titleEl.textContent = `Class ${cls} Notes`;
    if (notesQuote && cls) notesQuote.textContent = `Formulas and notes for Class ${cls}. Choose a subject below.`;
    // show subject buttons only when a class is selected
    document.querySelectorAll('.subject-btn').forEach(b => {
        if (cls) b.style.display = 'inline-block'; else b.style.display = 'none';
    });
    if (params.subject) showNotes(params.subject);
}

// --- Dark mode toggle wiring for UI switches ---
function initDarkToggle() {
    const el = document.getElementById('dark-mode-toggle');
    if (!el) return;
    // set initial state: checked means dark mode enabled
    el.checked = getStoredDarkMode();
    el.addEventListener('change', function () {
        const enabled = !!el.checked;
        setDarkModePreference(enabled);
    });
}

// --- Sample formulas dataset for classes 6-10 ---
const FORMULAS = {
    6: {
        physics: [
            ['Units & Measurements', ''],
            ['Length', 'm (metre)'],
            ['Mass', 'kg (kilogram)'],
            ['Time', 's (second)'],
            ['Force', 'N (newton)'],
            ['Work', 'J (joule)'],
            ['Speed', 'm/s (metre per second)'],
            ['Density', 'kg/m³'],
            ['', ''],
            ['Unit Conversions', ''],
            ['1 km = 1000 m', '1 m = 100 cm'],
            ['1 cm = 10 mm', '1 kg = 1000 g'],
            ['1 hour = 60 min', '1 min = 60 sec'],
            ['1 litre = 1000 mL', '1 m³ = 1000 L'],
            ['', ''],
            ['Speed Formula', 'v = d / t'],
            ['Distance = Speed × Time', ''],
            ['Time = Distance ÷ Speed', ''],
            ['Average Speed', 'v_avg = Total Distance / Total Time'],
            ['', ''],
            ['Force (Push/Pull)', 'F = ma (advanced)'],
            ['Work', 'W = F × d'],
            ['Simple Machines - MA', 'MA = Load / Effort'],
            ['Efficiency', 'Efficiency = (Output / Input) × 100%'],
            ['', ''],
            ['Density', 'ρ = m / V'],
            ['Mass from Density', 'Mass = Density × Volume'],
            ['Volume from Density', 'Volume = Mass ÷ Density'],
            ['', ''],
            ['Temperature Conversions', ''],
            ['°F = (9/5 × °C) + 32', ''],
            ['°C = 5/9 × (°F − 32)', ''],
            ['', ''],
            ['Electricity (Basic)', ''],
            ['Series Voltage', 'Total = Sum of cell voltages'],
            ['3 × 1.5V cells', '= 4.5V'],
            ['', ''],
            ['Light - Law of Reflection', 'Angle of incidence = Angle of reflection'],
            ['i = r', ''],
            ['', ''],
            ['Magnetism', 'Like poles repel'],
            ['', 'Unlike poles attract'],
            ['', ''],
            ['Pressure (Advanced)', 'P = F / A'],
            ['', ''],
            ['Weight', 'W = m × g'],
            ['g ≈ 9.8 m/s²', 'Example: 8 kg → 78.4 N'],
            ['', ''],
            ['Volume of Cube', 'V = a³'],
            ['Volume of Cuboid', 'V = l × b × h'],
            ['', ''],
            ['Key Relationships', ''],
            ['Speed = Distance ÷ Time', ''],
            ['Work = Force × Distance', ''],
            ['Density = Mass ÷ Volume', ''],
            ['Pressure = Force ÷ Area', ''],
            ['Weight = Mass × Gravity', '']
        ],
        maths: [
            ['Number System and Basic Operations', ''],
            ['Addition', 'Sum = Addend₁ + Addend₂'],
            ['Subtraction', 'Difference = Minuend − Subtrahend'],
            ['Multiplication', 'Product = Multiplicand × Multiplier'],
            ['Division', 'Dividend = Divisor × Quotient + Remainder'],
            ['', ''],
            ['BODMAS Rule', 'Brackets → Orders (powers & roots) → Division → Multiplication → Addition → Subtraction'],
            ['', ''],
            ['Factors and Multiples', ''],
            ['HCF (Highest Common Factor)', 'Greatest number that divides all given numbers exactly'],
            ['LCM (Least Common Multiple)', 'Smallest number that is a multiple of all given numbers'],
            ['', ''],
            ['Fractions', ''],
            ['Equivalent Fractions', 'Multiply or divide numerator and denominator by same number'],
            ['Fraction of Quantity', 'Fraction of Quantity = (Numerator / Denominator) × Quantity'],
            ['Addition (same denominator)', 'a/b + c/b = (a + c) / b'],
            ['Addition (different denominators)', 'a/b + c/d = (ad + bc) / bd'],
            ['Multiplication', 'a/b × c/d = (a × c) / (b × d)'],
            ['Division', 'a/b ÷ c/d = a/b × d/c'],
            ['', ''],
            ['Decimals', ''],
            ['Tenths', '1/10 = 0.1'],
            ['Hundredths', '1/100 = 0.01'],
            ['Thousandths', '1/1000 = 0.001'],
            ['', ''],
            ['Ratio and Proportion', ''],
            ['Ratio', 'a : b'],
            ['Proportion', 'a/b = c/d'],
            ['', ''],
            ['Percentages', 'Percentage = (Part ÷ Whole) × 100'],
            ['Finding percentage of a number', 'Value = (p / 100) × N'],
            ['', ''],
            ['Profit and Loss', ''],
            ['Profit', 'Profit = SP − CP'],
            ['Loss', 'Loss = CP − SP'],
            ['Profit Percentage', 'Profit% = (Profit / CP) × 100'],
            ['Loss Percentage', 'Loss% = (Loss / CP) × 100'],
            ['', ''],
            ['Perimeter and Area', ''],
            ['Rectangle', 'P = 2(l + b); A = l × b'],
            ['Square', 'P = 4a; A = a²'],
            ['Triangle', 'A = 1/2 × b × h'],
            ['Circle', 'Circumference = 2πr; Area = πr²'],
            ['', ''],
            ['Volume', ''],
            ['Cuboid', 'V = l × b × h'],
            ['Cube', 'V = a³'],
            ['', ''],
            ['Algebra', ''],
            ['Variable Expression', 'Example: 3x + 5'],
            ['Substitution', 'Evaluate by replacing x with a value (e.g., 3x+5 when x=2 → 3×2+5=11)'],
            ['', ''],
            ['Data Handling', 'Mean = Sum of observations ÷ Number of observations'],
            ['', ''],
            ['Geometry Facts', 'Sum of angles in triangle = 180°; Sum of angles around a point = 360°'],
            ['', ''],
            ['Most Important Formulas to Memorize', ''],
            ['Percentage', 'Percentage = (Part ÷ Whole) × 100'],
            ['Profit', 'Profit = SP − CP'],
            ['Area of Rectangle', 'A = l × b'],
            ['Area of Square', 'A = a²'],
            ['Area of Triangle', 'A = 1/2 × b × h'],
            ['Circumference', 'C = 2πr'],
            ['Area of Circle', 'A = πr²'],
            ['Volume of Cuboid', 'V = l × b × h'],
            ['Volume of Cube', 'V = a³'],
            ['Mean', 'Mean = Sum of observations ÷ Number of observations']
        ],
        chemistry: [
            ['What is Chemistry?', 'Chemistry studies matter, its properties, how substances interact, and how they change into new substances.'],
            ['', ''],
            ['Matter and Materials', ''],
            ['Matter', 'Anything that has mass and occupies space (volume). Examples: Air, Water, Stone, Wood, Iron'],
            ['Material', 'A substance used to make objects. Examples: Plastic, Glass, Cotton, Steel, Rubber'],
            ['Substance', 'A particular kind of matter with fixed properties. Examples: Water, Salt, Sugar, Oxygen'],
            ['', ''],
            ['States of Matter', ''],
            ['Solid', 'Fixed shape and fixed volume'],
            ['Liquid', 'Fixed volume but no fixed shape'],
            ['Gas', 'No fixed shape and no fixed volume'],
            ['', ''],
            ['Physical Properties', ''],
            ['Mass', 'Amount of matter in an object'],
            ['Volume', 'Amount of space occupied by a substance'],
            ['Density', 'Density = Mass ÷ Volume; ρ = m / V'],
            ['', 'Example: 2.4 kg / L'],
            ['', ''],
            ['Temperature', 'Temperature measures how hot or cold a substance is'],
            ['Temperature Conversion', '°F = (9/5 × °C) + 32; °C = 5/9 × (°F − 32)'],
            ['', ''],
            ['Mixtures and Solutions', ''],
            ['Mixture', 'Two or more substances combined physically without chemical change'],
            ['Solution', 'A uniform mixture where one substance (solute) dissolves in another (solvent)'],
            ['Solute', 'Substance that gets dissolved'],
            ['Solvent', 'Substance that dissolves the solute'],
            ['Solubility', 'Ability of a substance to dissolve in a solvent'],
            ['', ''],
            ['Separation Methods', ''],
            ['Filtration', 'Separate insoluble solids from liquids using a filter'],
            ['Evaporation', 'Separate dissolved solids by heating the solution to evaporate solvent'],
            ['Sedimentation', 'Allow heavier particles to settle at the bottom'],
            ['Decantation', 'Pour off clear liquid after sedimentation'],
            ['Sieving', 'Separate particles based on size'],
            ['Magnetic Separation', 'Use a magnet to separate magnetic substances'],
            ['', ''],
            ['Elements, Compounds, and Mixtures', ''],
            ['Element', 'Pure substance made of one type of atom. Examples: Hydrogen, Oxygen, Iron, Gold'],
            ['Compound', 'Substance formed when two or more elements combine chemically. Examples: Water (H2O), CO2, NaCl'],
            ['Mixture', 'Contains substances combined physically without fixed composition'],
            ['', ''],
            ['Water and Air', ''],
            ['Potable Water', 'Water safe for drinking'],
            ['Dissolved Substances', 'Substances present in water in dissolved form'],
            ['Atmosphere', 'Layer of gases surrounding the Earth'],
            ['', ''],
            ['Physical and Chemical Changes', ''],
            ['Physical Change', 'No new substance formed (e.g., melting ice, cutting paper, dissolving sugar)'],
            ['Chemical Change', 'One or more new substances formed (e.g., rusting, burning, cooking)'],
            ['', ''],
            ['Acids and Bases (Intro)', ''],
            ['Acid', 'Tastes sour; turns blue litmus red (examples: lemon juice, vinegar)'],
            ['Base', 'Turns red litmus blue (examples: soap solution, baking soda solution)'],
            ['Indicator', 'Substance that changes color to show acidity/basicity'],
            ['', ''],
            ['Atom and Molecule (Awareness)', ''],
            ['Atom', 'Smallest particle of an element that retains its properties'],
            ['Molecule', 'Two or more atoms chemically bonded together'],
            ['', ''],
            ['Conservation of Matter', 'Matter cannot be created or destroyed; only changes form'],
            ['', ''],
            ['Important Laboratory Apparatus', 'Beaker, Test Tube, Funnel, Measuring Cylinder, Thermometer, Balance'],
            ['', ''],
            ['Most Important Chemistry Formulas', ''],
            ['Density', 'Density = Mass ÷ Volume; ρ = m / V'],
            ['Mass', 'Mass = Density × Volume'],
            ['Volume', 'Volume = Mass ÷ Density'],
            ['Temperature Conversions', '°F = (9/5 × °C) + 32; °C = 5/9 × (°F − 32)'],
            ['', ''],
            ['Top Definitions to Memorize', ''],
            ['Matter', 'Anything that has mass and occupies space'],
            ['Substance', 'A particular kind of matter with fixed properties'],
            ['Solid', 'Fixed shape and fixed volume'],
            ['Liquid', 'Fixed volume but no fixed shape'],
            ['Gas', 'No fixed shape and no fixed volume'],
            ['Mixture', 'Two or more substances combined physically'],
            ['Solution', 'A uniform mixture where one substance dissolves in another'],
            ['Solute', 'Substance that gets dissolved in a solution'],
            ['Solvent', 'Substance that dissolves the solute'],
            ['Element', 'Pure substance made of only one type of atom'],
            ['Compound', 'Substance formed when two or more elements combine chemically'],
            ['Physical Change', 'A change where no new substance is formed'],
            ['Chemical Change', 'A change where one or more new substances are formed'],
            ['Acid', 'Tastes sour and turns blue litmus red'],
            ['Base', 'Turns red litmus blue'],
            ['Atom', 'Smallest particle of an element that retains its properties'],
            ['Molecule', 'Two or more atoms chemically bonded together']
        ]
    },
    7: {
        physics: [
            ['Units and Measurements', ''],
            ['Physical Quantity - SI Unit', 'Length (m), Mass (kg), Time (s), Temperature (°C), Force (N), Work (J), Power (W)'],
            ['Speed (m/s), Pressure (Pa), Density (kg/m³), Energy (J)', ''],
            ['', ''],
            ['Common Conversions', ''],
            ['Length', '1 km = 1000 m; 1 m = 100 cm'],
            ['Mass', '1 kg = 1000 g'],
            ['Time', '1 hour = 3600 s'],
            ['Volume', '1 L = 1000 mL'],
            ['', ''],
            ['Motion', ''],
            ['Speed', 'v = d / t (distance ÷ time)'],
            ['Distance', 'Distance = Speed × Time'],
            ['Time', 'Time = Distance ÷ Speed'],
            ['Average Speed', 'v_avg = Total Distance / Total Time'],
            ['', ''],
            ['Force and Newton\'s Second Law', ''],
            ['Force', 'F = m × a (force = mass × acceleration)'],
            ['', ''],
            ['Work', 'W = F × d (force × distance)'],
            ['', ''],
            ['Power', 'P = W / t (work ÷ time)'],
            ['', ''],
            ['Density', 'ρ = m / V (mass ÷ volume); Example: 2.4 kg/L'],
            ['', ''],
            ['Pressure', 'P = F / A (force ÷ area)'],
            ['', ''],
            ['Weight', 'W = m × g (mass × gravity); g ≈ 9.8 m/s²; Example: 8 kg → 78.4 N'],
            ['', ''],
            ['Light', ''],
            ['Reflection', 'Angle of Incidence = Angle of Reflection (i = r)'],
            ['', ''],
            ['Temperature Conversion', ''],
            ['Celsius to Fahrenheit', '°F = (9/5 × °C) + 32'],
            ['Fahrenheit to Celsius', '°C = 5/9 × (°F − 32)'],
            ['', ''],
            ['Simple Machines', ''],
            ['Mechanical Advantage', 'MA = Load ÷ Effort'],
            ['Efficiency', 'Efficiency = (Output ÷ Input) × 100%'],
            ['', ''],
            ['Electricity', ''],
            ['Current', 'I = Q / t (charge ÷ time)'],
            ['Voltage in Series', 'Total Voltage = Sum of cell voltages'],
            ['', ''],
            ['Ohm\'s Law', 'V = I × R (voltage = current × resistance)'],
            ['Current', 'I = V / R (voltage ÷ resistance)'],
            ['Resistance', 'R = V / I (voltage ÷ current)'],
            ['Example', 'V = 12V, R = 6Ω → I = 12/6 = 2A'],
            ['', ''],
            ['Volume', ''],
            ['Cube', 'V = a³'],
            ['Cuboid', 'V = l × b × h'],
            ['', ''],
            ['Most Important Class 7 Physics Formulas', ''],
            ['Speed', 'Speed = Distance ÷ Time'],
            ['Work', 'Work = Force × Distance'],
            ['Power', 'Power = Work ÷ Time'],
            ['Density', 'Density = Mass ÷ Volume'],
            ['Pressure', 'Pressure = Force ÷ Area'],
            ['Weight', 'Weight = Mass × Gravity'],
            ['Mechanical Advantage', 'MA = Load ÷ Effort'],
            ['Efficiency', 'Efficiency = (Output ÷ Input) × 100%'],
            ['Light Reflection', 'Angle of Incidence = Angle of Reflection (i = r)'],
            ['Ohm\'s Law', 'V = I × R']
        ],
        maths: [
            ['Integers and Rational Numbers', ''],
            ['Addition and Subtraction Rules', 'Same signs → Add and keep common sign; Different signs → Subtract smaller from larger, keep sign of larger'],
            ['Rational Number Definition', 'p/q where q ≠ 0 (p and q are integers)'],
            ['', ''],
            ['Fractions', ''],
            ['Addition (Same Denominator)', 'a/b + c/b = (a+c)/b'],
            ['Multiplication', '(a/b) × (c/d) = ac/bd'],
            ['Division', '(a/b) ÷ (c/d) = ad/bc'],
            ['', ''],
            ['Ratio, Proportion and Percentage', ''],
            ['Percentage', 'Percentage = (Part ÷ Whole) × 100'],
            ['Proportion', 'a/b = c/d'],
            ['', ''],
            ['Profit, Loss and Discount', ''],
            ['Profit', 'Profit = SP − CP (Selling Price − Cost Price)'],
            ['Loss', 'Loss = CP − SP'],
            ['Discount', 'Discount = MP − SP (Marked Price − Selling Price)'],
            ['Discount Percentage', 'Discount % = (Discount ÷ MP) × 100'],
            ['', ''],
            ['Simple Interest', ''],
            ['Simple Interest Formula', 'SI = (P × R × T) / 100'],
            ['Where', 'P = Principal, R = Rate of Interest (%), T = Time (years)'],
            ['Amount', 'Amount = Principal + Simple Interest'],
            ['', ''],
            ['Algebra', ''],
            ['Linear Expression', 'Example: 3x + 5 (variable with operations)'],
            ['Simple Equation', 'ax + b = c (linear equation form)'],
            ['', ''],
            ['Perimeter and Area', ''],
            ['Rectangle', 'Perimeter = 2(l + b); Area = l × b'],
            ['Square', 'Perimeter = 4a; Area = a²'],
            ['Triangle', 'Area = ½ × b × h (base × height ÷ 2)'],
            ['Parallelogram', 'Area = b × h'],
            ['Circle Circumference', 'C = 2πr (or C = πd where d = diameter)'],
            ['Circle Area', 'A = πr²'],
            ['', ''],
            ['Volume and Surface Area', ''],
            ['Cube Volume', 'V = a³ (side cubed)'],
            ['Cube Surface Area', 'SA = 6a²'],
            ['Cuboid Volume', 'V = l × b × h'],
            ['Cuboid Surface Area', 'SA = 2(lb + bh + hl)'],
            ['', ''],
            ['Data Handling', ''],
            ['Mean', 'Mean = (Sum of Observations) ÷ (Number of Observations)'],
            ['', ''],
            ['Geometry Facts', ''],
            ['Sum of Angles in Triangle', 'A + B + C = 180°'],
            ['Sum of Angles Around a Point', '360°'],
            ['', ''],
            ['Most Important Class 7 Mathematics Formulas', ''],
            ['Percentage', 'Percentage = (Part ÷ Whole) × 100'],
            ['Simple Interest', 'SI = (P × R × T) ÷ 100'],
            ['Profit', 'Profit = SP − CP'],
            ['Area of Triangle', 'Area = ½ × b × h'],
            ['Area of Parallelogram', 'Area = b × h'],
            ['Volume of Cube', 'V = a³'],
            ['Surface Area of Cube', 'SA = 6a²'],
            ['Mean', 'Mean = (Sum of Observations) ÷ (Number of Observations)']
        ],
        chemistry: [
            ['Density', ''],
            ['Density Formula', 'ρ = m / V (m is mass; V is volume)'],
            ['Common Unit', 'kg/L or kg/m³ (e.g., 2.4 kg/L)'],
            ['Mass from Density', 'Mass = Density × Volume'],
            ['Volume from Density', 'Volume = Mass ÷ Density'],
            ['', ''],
            ['Acids, Bases and Salts', ''],
            ['Neutralization Reaction', 'Acid + Base → Salt + Water'],
            ['Example', 'HCl + NaOH → NaCl + H₂O'],
            ['', ''],
            ['Chemical Symbols to Memorize', ''],
            ['Water', 'H₂O'],
            ['Oxygen', 'O₂'],
            ['Hydrogen', 'H₂'],
            ['Nitrogen', 'N₂'],
            ['Carbon dioxide', 'CO₂'],
            ['Common salt', 'NaCl'],
            ['Baking soda', 'NaHCO₃'],
            ['Vinegar (Acetic acid)', 'CH₃COOH'],
            ['Hydrochloric acid', 'HCl'],
            ['Sodium hydroxide', 'NaOH'],
            ['', ''],
            ['Physical and Chemical Changes', ''],
            ['Rusting of Iron', 'Iron + Oxygen + Water → Rust'],
            ['Simplified Formula', 'Fe + O₂ + H₂O → Fe₂O₃·xH₂O'],
            ['', ''],
            ['Combustion (Burning)', ''],
            ['Carbon Combustion', 'Carbon + Oxygen → Carbon Dioxide (C + O₂ → CO₂)'],
            ['Hydrogen Combustion', 'Hydrogen + Oxygen → Water (2H₂ + O₂ → 2H₂O)'],
            ['', ''],
            ['Important Definitions', ''],
            ['Atom', 'Smallest particle of an element'],
            ['Molecule', 'Two or more atoms chemically combined (Examples: H₂, O₂, H₂O)'],
            ['Element', 'Pure substance made of only one kind of atom (Examples: Iron [Fe], Gold [Au], Oxygen [O])'],
            ['Compound', 'Substance formed by chemical combination of elements (Examples: Water [H₂O], Carbon dioxide [CO₂])'],
            ['Mixture', 'Two or more substances mixed physically (Examples: Air, Salt water)'],
            ['Acid', 'Sour substances that turn blue litmus red'],
            ['Base', 'Bitter substances that turn red litmus blue'],
            ['Salt', 'Substance formed when an acid reacts with a base'],
            ['Indicator', 'Substance that tells whether a solution is acidic or basic (Examples: Litmus, Turmeric, China Rose)'],
            ['', ''],
            ['Cambridge/IB Extensions', ''],
            ['Percentage Composition', 'Percentage = (Part ÷ Whole) × 100'],
            ['Concentration', 'Concentration = Amount of Solute ÷ Amount of Solution'],
            ['Speed of Dissolving Factors', 'Depends on: Temperature, Stirring, Particle size'],
            ['', ''],
            ['Ultimate Class 7 Chemistry Formula Sheet', ''],
            ['Density', 'Density = Mass ÷ Volume'],
            ['Mass', 'Mass = Density × Volume'],
            ['Volume', 'Volume = Mass ÷ Density'],
            ['Neutralization', 'Acid + Base → Salt + Water'],
            ['Carbon Combustion', 'C + O₂ → CO₂'],
            ['Hydrogen Combustion', '2H₂ + O₂ → 2H₂O'],
            ['Rusting', 'Fe + O₂ + H₂O → Rust'],
            ['Percentage', 'Percentage = (Part ÷ Whole) × 100'],
            ['Concentration', 'Concentration = Solute ÷ Solution']
        ]
    },
    8: {
        physics: [
            ['Speed, Distance and Time', ''],
            ['Speed Formula', 'Speed = Distance ÷ Time'],
            ['Distance Formula', 'Distance = Speed × Time'],
            ['Time Formula', 'Time = Distance ÷ Speed'],
            ['', ''],
            ['Average Speed', 'Average Speed = Total Distance ÷ Total Time'],
            ['', ''],
            ['Force', ''],
            ['Force Formula', 'Force = Mass × Acceleration (F = m × a)'],
            ['', ''],
            ['Pressure', ''],
            ['Pressure Formula', 'Pressure = Force ÷ Area (P = F / A)'],
            ['', ''],
            ['Work', ''],
            ['Work Formula', 'Work = Force × Distance (W = F × d)'],
            ['', ''],
            ['Power', ''],
            ['Power Formula', 'Power = Work ÷ Time (P = W / t)'],
            ['', ''],
            ['Energy', ''],
            ['Kinetic Energy', 'KE = ½ × m × v²'],
            ['Potential Energy', 'PE = mgh (g ≈ 9.8 m/s²; m is mass, h is height)'],
            ['Example Calculation', 'm=3.4kg, h=9m → PE = 3.4 × 9.8 × 9 = 299.88J'],
            ['', ''],
            ['Weight', ''],
            ['Weight Formula', 'Fg = mg (g ≈ 9.8 m/s²)'],
            ['Example Weight', 'm=8kg → Fg = 8 × 9.8 = 78.4 N'],
            ['', ''],
            ['Simple Machines', ''],
            ['Mechanical Advantage (MA)', 'MA = Load ÷ Effort'],
            ['Velocity Ratio (VR)', 'VR = Distance moved by effort ÷ Distance moved by load'],
            ['Efficiency', 'Efficiency = (Output Work / Input Work) × 100%'],
            ['', ''],
            ['Heat', ''],
            ['Heat Energy Formula', 'Heat Energy = m × c × ΔT (m = mass, c = specific heat, ΔT = temp change)'],
            ['', ''],
            ['Temperature Conversion', ''],
            ['Fahrenheit to Celsius', '°C = (5/9)(°F − 32)'],
            ['Celsius to Fahrenheit', '°F = (9/5 × °C) + 32'],
            ['', ''],
            ['Sound', ''],
            ['Speed of Sound', 'v = fλ (f is frequency, λ is wavelength)'],
            ['Example speed', 'f=2Hz, λ=3m → v = 2 × 3 = 6m/s'],
            ['Frequency and Period', 'f = 1/T (T is period in seconds)'],
            ['Example frequency', 'T=2s → f = 1/2 = 0.5Hz'],
            ['', ''],
            ['Light (Basic Optics)', ''],
            ['Mirror Formula', '1/f = 1/u + 1/v (f = focal length, u = object distance, v = image distance)'],
            ['Example', 'u = object dist, v ≈ 28cm, magnification m ≈ -1 for Concave Mirror'],
            ['', ''],
            ['Electricity', ''],
            ['Ohm’s Law', 'I = V / R (V is voltage, I is current, R is resistance)'],
            ['Example current', 'V=12V, R=6Ω → I = 12/6 = 2A'],
            ['Electric Power', 'Power = Voltage × Current (P = V × I)'],
            ['', ''],
            ['Density', ''],
            ['Density Formula', 'Density = Mass ÷ Volume (ρ = m / V)'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['Speed', 'Speed = Distance / Time'],
            ['Force', 'F = m × a'],
            ['Pressure', 'P = F / A'],
            ['Work', 'W = F × d'],
            ['Power', 'Power = W / t'],
            ['Kinetic Energy', 'KE = ½mv²'],
            ['Potential Energy', 'PE = mgh'],
            ['Weight', 'Weight = mg'],
            ['Heat', 'Heat = mcΔT'],
            ['Ohm’s Law', 'V = IR'],
            ['Speed of Sound', 'v = fλ'],
            ['Frequency', 'f = 1/T']
        ],
        maths: [
            ['Rational Numbers', ''],
            ['Addition', 'a/b + c/d = (ad + bc) / bd'],
            ['Subtraction', 'a/b − c/d = (ad − bc) / bd'],
            ['Multiplication', 'a/b × c/d = (ac) / (bd)'],
            ['Division', 'a/b ÷ c/d = (a/b) × (d/c)'],
            ['', ''],
            ['Exponents (Powers)', ''],
            ['Multiplication Rule', 'aᵐ × aⁿ = aᵐ⁺ⁿ'],
            ['Division Rule', 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ'],
            ['Power of a Power', '(aᵐ)ⁿ = aᵐⁿ'],
            ['Power of a Product', '(ab)ᵐ = aᵐ bᵐ'],
            ['Zero Exponent', 'a⁰ = 1'],
            ['Negative Exponent', 'a⁻ⁿ = 1/aⁿ'],
            ['', ''],
            ['Squares and Square Roots', ''],
            ['Identity 1', '(a + b)² = a² + 2ab + b²'],
            ['Identity 2', '(a − b)² = a² − 2ab + b²'],
            ['Identity 3', '(a + b)(a − b) = a² − b²'],
            ['', ''],
            ['Cubes and Cube Roots', ''],
            ['Identity 1', '(a + b)³ = a³ + b³ + 3ab(a + b)'],
            ['Identity 2', '(a − b)³ = a³ − b³ − 3ab(a − b)'],
            ['Identity 3', 'a³ + b³ = (a + b)(a² − ab + b²)'],
            ['Identity 4', 'a³ − b³ = (a − b)(a² + ab + b²)'],
            ['', ''],
            ['Algebraic Identities', ''],
            ['Identity 1', '(x + a)(x + b) = x² + (a + b)x + ab'],
            ['Identity 2', '(x − a)(x − b) = x² − (a + b)x + ab'],
            ['', ''],
            ['Linear Equations (One Variable)', ''],
            ['General Form', 'ax + b = 0'],
            ['Solution', 'x = −b/a'],
            ['', ''],
            ['Percentage', ''],
            ['Percentage Formula', 'Percentage = (Value / Total Value) × 100'],
            ['Value Formula', 'Value = (Percentage × Total) / 100'],
            ['', ''],
            ['Profit, Loss and Discount', ''],
            ['Profit', 'Profit = SP − CP'],
            ['Loss', 'Loss = CP − SP'],
            ['Profit Percentage', 'Profit % = (Profit / CP) × 100'],
            ['Loss Percentage', 'Loss % = (Loss / CP) × 100'],
            ['Discount', 'Discount = MP − SP'],
            ['Discount Percentage', 'Discount % = (Discount / MP) × 100'],
            ['Helper definitions', 'CP = Cost Price, SP = Selling Price, MP = Marked Price'],
            ['', ''],
            ['Simple Interest (SI)', ''],
            ['Simple Interest', 'SI = (P × R × T) / 100'],
            ['Total Amount', 'Amount = P + SI (P = Principal, R = Rate, T = Time)'],
            ['', ''],
            ['Time and Work', ''],
            ['General Formula', 'Work = Rate × Time'],
            ['Unit Work rate', 'If A can do work in x days, 1 day work = 1/x'],
            ['', ''],
            ['Speed, Time and Distance', ''],
            ['Speed', 'Speed = Distance / Time'],
            ['Distance', 'Distance = Speed × Time'],
            ['Time', 'Time = Distance / Speed'],
            ['', ''],
            ['Mensuration (Perimeter & Area)', ''],
            ['Rectangle Perimeter', 'Perimeter = 2(l + b)'],
            ['Rectangle Area', 'Area = l × b'],
            ['Square Perimeter', 'Perimeter = 4a'],
            ['Square Area', 'Area = a²'],
            ['Triangle Area', 'Area = (1/2) × base × height'],
            ['Parallelogram Area', 'Area = base × height'],
            ['Trapezium Area', 'Area = ½ × (sum of parallel sides) × height'],
            ['', ''],
            ['Surface Area and Volume', ''],
            ['Cube Surface Area', 'Surface Area = 6a²'],
            ['Cube Volume', 'Volume = a³'],
            ['Cuboid Surface Area', 'Surface Area = 2(lb + bh + hl)'],
            ['Cuboid Volume', 'Volume = l × b × h'],
            ['Cylinder Volume', 'Volume = πr²h (Intro level)'],
            ['', ''],
            ['Data Handling', ''],
            ['Mean', 'Mean = (Sum of Observations) / (Number of Observations)'],
            ['', ''],
            ['Probability (Basic)', ''],
            ['Probability', 'Probability = (Favourable outcomes) / (Total outcomes)'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['Simple Interest', 'SI = (P × R × T) / 100'],
            ['Profit Percentage', 'Profit % = (Profit / CP) × 100'],
            ['Speed Formula', 'Speed = Distance / Time'],
            ['Triangle Area', 'Area of triangle = ½ × b × h'],
            ['Cube Volume', 'Volume of cube = a³'],
            ['Algebraic Square', '(a + b)² = a² + 2ab + b²'],
            ['Exponents multiplication', 'aᵐ × aⁿ = aᵐ⁺ⁿ'],
            ['Mean Formula', 'Mean = Sum / Number'],
            ['Probability Formula', 'Probability = Favourable / Total']
        ],
        chemistry: [
            ['Matter', ''],
            ['Density Formula', 'ρ = m / V (m is mass; V is volume)'],
            ['Example density', '2.4 kg/L'],
            ['Matter definition', 'Anything that has mass and occupies space'],
            ['Mass definition', 'Amount of substance in an object'],
            ['Volume definition', 'Space occupied by an object'],
            ['Density definition', 'Mass per unit volume'],
            ['', ''],
            ['States of Matter', ''],
            ['Solid', 'Fixed shape and volume'],
            ['Liquid', 'Fixed volume but no fixed shape'],
            ['Gas', 'No fixed shape or volume'],
            ['Diffusion', 'Mixing of particles on their own'],
            ['', ''],
            ['Elements, Compounds and Mixtures', ''],
            ['Water Formula', 'H₂O'],
            ['Carbon dioxide Formula', 'CO₂'],
            ['Sodium chloride Formula', 'NaCl'],
            ['Element', 'Pure substance made of one type of atom'],
            ['Compound', 'Two or more elements chemically combined'],
            ['Mixture', 'Substances mixed physically'],
            ['Solution', 'Homogeneous mixture'],
            ['', ''],
            ['Atomic Structure', ''],
            ['Atomic Number', 'Atomic Number = Number of Protons'],
            ['Mass Number', 'Mass Number = Protons + Neutrons'],
            ['Atom', 'Smallest unit of an element'],
            ['Proton', 'Positive particle'],
            ['Electron', 'Negative particle'],
            ['Neutron', 'Neutral particle'],
            ['', ''],
            ['Chemical Reactions', ''],
            ['General Form', 'Reactants → Products'],
            ['Example', 'C + O₂ → CO₂'],
            ['Chemical Reaction', 'Change forming new substances'],
            ['Reactants', 'Starting substances'],
            ['Products', 'New substances formed'],
            ['', ''],
            ['Acids, Bases and Salts', ''],
            ['Reaction Formula', 'Acid + Base → Salt + Water'],
            ['Example', 'HCl + NaOH → NaCl + H₂O'],
            ['Acid', 'Turns blue litmus red'],
            ['Base', 'Turns red litmus blue'],
            ['Salt', 'Formed from acid + base reaction'],
            ['Indicator', 'Shows acidic/basic nature'],
            ['', ''],
            ['Combustion and Flame', ''],
            ['Carbon Burning', 'C + O₂ → CO₂'],
            ['Hydrogen Burning', '2H₂ + O₂ → 2H₂O'],
            ['Combustion', 'Burning of a substance'],
            ['Fuel', 'Substance that burns'],
            ['Flame', 'Visible burning part'],
            ['', ''],
            ['Metals and Non-metals', ''],
            ['Rusting of Iron', 'Fe + O₂ → Rust'],
            ['General Form', 'Metal + Oxygen → Metal Oxide'],
            ['Metal', 'Good conductor, shiny'],
            ['Non-metal', 'Poor conductor, dull'],
            ['Corrosion', 'Slow damage of metal'],
            ['', ''],
            ['Coal and Petroleum', ''],
            ['Fossil Fuels', 'Fuels formed from dead organisms'],
            ['Petroleum', 'Liquid fossil fuel'],
            ['Coal', 'Solid fossil fuel'],
            ['', ''],
            ['Pollution', ''],
            ['Pollution definition', 'Contamination of environment'],
            ['Air Pollution', 'Harmful gases in air'],
            ['Water Pollution', 'Contamination of water'],
            ['', ''],
            ['Concentration (International Boards)', ''],
            ['Molarity Formula', 'M = n / V (n is moles, V is volume in Liters)'],
            ['Example Calculation', 'n = 1.2 mol, V = 0.8 L → M = 1.2 / 0.8 = 1.5 mol/L'],
            ['Solute', 'Substance dissolved'],
            ['Solvent', 'Substance that dissolves solute'],
            ['Solution', 'Mixture of solute and solvent'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['Density Formula', 'Density = Mass / Volume'],
            ['Atomic Number', 'Atomic Number = Protons'],
            ['Mass Number', 'Mass Number = Protons + Neutrons'],
            ['Neutralization', 'Acid + Base → Salt + Water'],
            ['Carbon Combustion', 'C + O₂ → CO₂'],
            ['Hydrogen Combustion', '2H₂ + O₂ → 2H₂O'],
            ['Molarity Formula', 'Molarity = n / V']
        ]
    },
    9: {
        physics: [
            ['Motion', ''],
            ['First Equation of Motion', 'v = u + at (v = final, u = initial velocity, a = acceleration, t = time)'],
            ['Example Velocity Calculation', 'u=3m/s, a=1.2m/s², t=4s → v = 3 + 1.2 × 4 = 7.8 m/s'],
            ['Second Equation of Motion', 's = ut + ½at² (s = displacement)'],
            ['Example Displacement', 'u=3m/s, a=1.2m/s², t=4s → s = 3×4 + ½×1.2×4² = 21.6 m'],
            ['Third Equation of Motion', 'v² = u² + 2as'],
            ['Motion definition', 'Change in position with time'],
            ['Distance definition', 'Total path covered'],
            ['Displacement definition', 'Shortest distance between two points'],
            ['Velocity definition', 'Speed in a given direction'],
            ['Acceleration definition', 'Rate of change of velocity'],
            ['', ''],
            ['Force and Laws of Motion', ''],
            ['Momentum Formula', 'p = mv (m = mass, v = velocity)'],
            ['Newton’s Second Law', 'Force = Rate of change of momentum (F = ma)'],
            ['Force definition', 'Push or pull acting on an object'],
            ['Momentum definition', 'Product of mass and velocity'],
            ['Inertia definition', 'Resistance of an object to change in its state of motion or rest'],
            ['Newton’s Laws of Motion', 'Three laws explaining relationship between force and motion'],
            ['', ''],
            ['Gravitation', ''],
            ['Weight Formula', 'Fg = mg (g ≈ 9.8 m/s²)'],
            ['Example Weight', 'm=8kg → Fg = 8 × 9.8 = 78.4 N'],
            ['Gravity definition', 'Force of attraction between any two objects'],
            ['Mass definition', 'Amount of matter in an object'],
            ['Weight definition', 'Force with which gravity pulls an object'],
            ['', ''],
            ['Work and Energy', ''],
            ['Work Formula', 'Work = Force × Distance (W = Fd)'],
            ['Potential Energy', 'PE = mgh (g ≈ 9.8 m/s², m is mass, h is height)'],
            ['Example PE Calculation', 'm=3.4kg, h=9m → PE = 3.4 × 9.8 × 9 = 299.88J'],
            ['Kinetic Energy', 'KE = ½mv²'],
            ['Work definition', 'Done when a force causes displacement of an object'],
            ['Energy definition', 'Capacity to do work'],
            ['Kinetic Energy definition', 'Energy possessed by an object due to its motion'],
            ['Potential Energy definition', 'Energy due to position or configuration'],
            ['', ''],
            ['Power', ''],
            ['Power Formula', 'Power = Work ÷ Time'],
            ['Power definition', 'Rate of doing work'],
            ['', ''],
            ['Sound', ''],
            ['Wave Speed Formula', 'v = fλ (f is frequency, λ is wavelength)'],
            ['Example wave speed', 'f=2Hz, λ=3m → v = 2 × 3 = 6m/s'],
            ['Frequency and Period', 'f = 1/T (T is period in seconds)'],
            ['Example frequency', 'T=2s → f = 1/2 = 0.5Hz'],
            ['Sound definition', 'Form of energy produced by vibrations'],
            ['Frequency definition', 'Number of vibrations per second'],
            ['Amplitude definition', 'Maximum displacement of wave from mean position'],
            ['Time Period definition', 'Time taken to complete one vibration'],
            ['', ''],
            ['Density', ''],
            ['Density Formula', 'Density = Mass ÷ Volume'],
            ['Density definition', 'Mass per unit volume'],
            ['', ''],
            ['Pressure in Fluids', ''],
            ['Pressure Formula', 'Pressure = Force ÷ Area (P = F/A)'],
            ['Pressure definition', 'Force acting per unit area'],
            ['Thrust definition', 'Total perpendicular force acting on a surface'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['First Equation of Motion', 'v = u + at'],
            ['Second Equation of Motion', 's = ut + ½at²'],
            ['Third Equation of Motion', 'v² = u² + 2as'],
            ['Momentum', 'p = mv'],
            ['Newton’s Second Law', 'F = ma'],
            ['Weight Formula', 'Weight = mg'],
            ['Work Formula', 'W = Fd'],
            ['Kinetic Energy', 'KE = ½mv²'],
            ['Potential Energy', 'PE = mgh'],
            ['Power Formula', 'Power = W/t'],
            ['Wave Speed', 'v = fλ'],
            ['Frequency Formula', 'f = 1/T']
        ],
        maths: [
            ['Number System', ''],
            ['Rational Number Form', 'p/q (where p, q are integers and q ≠ 0)'],
            ['Irrational Number Form', '√a (where a is not a perfect square)'],
            ['Natural Numbers', '1, 2, 3, 4, …'],
            ['Whole Numbers', '0, 1, 2, 3, …'],
            ['Integers', '…, −3, −2, −1, 0, 1, 2, 3, …'],
            ['Rational Numbers', 'Numbers that can be expressed as p/q'],
            ['Irrational Numbers', 'Numbers that cannot be written as p/q'],
            ['', ''],
            ['Polynomials', ''],
            ['General Form', 'p(x) = a₀ + a₁x + a₂x² + … + aₙxⁿ'],
            ['Remainder Theorem', 'If polynomial p(x) is divided by (x − a), remainder is p(a)'],
            ['Factor Theorem', 'If p(a) = 0, then (x − a) is a factor of p(x)'],
            ['Polynomial definition', 'Expression containing variables, coefficients and non-negative exponent powers'],
            ['Degree', 'The highest power of the variable in the polynomial'],
            ['Zero of Polynomial', 'The value of x for which p(x) = 0'],
            ['', ''],
            ['Coordinate Geometry', ''],
            ['Distance from Origin', 'd = √(x² + y²)'],
            ['Cartesian Plane', 'System of X-axis (horizontal) and Y-axis (vertical)'],
            ['Origin Coordinate', '(0, 0)'],
            ['Quadrants', 'Four regions formed by the axes (Q1: +,+, Q2: -,+, Q3: -,-, Q4: +,-)'],
            ['', ''],
            ['Linear Equations in Two Variables', ''],
            ['General Form', 'ax + by + c = 0 (a, b, c are real numbers; a, b ≠ 0)'],
            ['Solution definition', 'Ordered pair (x, y) that satisfies the equation'],
            ['Graph shape', 'Always represents a straight line'],
            ['', ''],
            ['Lines and Angles', ''],
            ['Linear Pair', 'Sum of adjacent angles on a straight line = 180°'],
            ['Angles on a Line', 'Sum of all angles on a straight line = 180°'],
            ['Vertically Opposite Angles', 'Intersecting lines form equal opposite angles'],
            ['Complementary Angles', 'Two angles whose sum = 90°'],
            ['Supplementary Angles', 'Two angles whose sum = 180°'],
            ['', ''],
            ['Triangles', ''],
            ['Angle Sum Property', 'Sum of three interior angles = 180°'],
            ['Exterior Angle Theorem', 'Exterior angle = Sum of two opposite interior angles'],
            ['Scalene Triangle', 'A triangle with all three sides of different lengths'],
            ['Isosceles Triangle', 'A triangle with two equal sides (and equal opposite angles)'],
            ['Equilateral Triangle', 'A triangle with all three sides equal (each angle = 60°)'],
            ['', ''],
            ['Quadrilaterals', ''],
            ['Angle Sum Property', 'Sum of all four angles in a quadrilateral = 360°'],
            ['Quadrilateral definition', 'A closed 2D shape with 4 straight sides'],
            ['Parallelogram', 'Opposite sides are parallel and equal; opposite angles are equal'],
            ['', ''],
            ['Areas of Parallelogram & Triangle', ''],
            ['Area of Parallelogram', 'Area = base × height'],
            ['Area of Triangle', 'Area = ½ × base × height'],
            ['Base definition', 'The bottom side or the side on which the height is drawn'],
            ['Height definition', 'The perpendicular distance from the base to the opposite vertex'],
            ['', ''],
            ['Circles', ''],
            ['Circumference', 'C = 2πr (or πd where d is diameter)'],
            ['Area of Circle', 'Area = πr²'],
            ['Radius', 'Distance from the center to any point on the boundary'],
            ['Diameter', 'Longest chord passing through the center (d = 2r)'],
            ['Chord', 'A straight line segment joining any two points on the circle boundary'],
            ['', ''],
            ['Surface Areas and Volumes', ''],
            ['Cube Total Surface Area', 'TSA = 6a²'],
            ['Cube Volume', 'Volume = a³'],
            ['Cuboid Total Surface Area', 'TSA = 2(lb + bh + hl)'],
            ['Cuboid Volume', 'Volume = l × b × h'],
            ['Cylinder Curved Surface Area', 'CSA = 2πrh'],
            ['Cylinder Total Surface Area', 'TSA = 2πr(r + h)'],
            ['Cylinder Volume', 'Volume = πr²h'],
            ['Surface Area definition', 'The total area of all the faces of a 3D object'],
            ['Volume definition', 'The total space occupied by a 3D object'],
            ['', ''],
            ['Heron’s Formula', ''],
            ['Semi-perimeter (s)', 's = (a + b + c) / 2'],
            ['Area of Triangle', 'Area = √[s(s − a)(s − b)(s − c)] (where a, b, c are side lengths)'],
            ['', ''],
            ['Statistics', ''],
            ['Mean', 'Mean = (Sum of observations) / (Number of observations)'],
            ['Data definition', 'A collection of numerical facts or information'],
            ['Frequency definition', 'The number of times a particular value occurs in the data'],
            ['', ''],
            ['Probability', ''],
            ['Probability Formula', 'Probability = Favourable outcomes / Total outcomes'],
            ['Experiment', 'An activity or trial that yields one or more outcomes'],
            ['Event', 'A set of one or more outcomes of an experiment'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['Linear Equation', 'ax + by + c = 0'],
            ['Triangle Area', 'Area of triangle = ½ × b × h'],
            ['Circle Area', 'Area of circle = πr²'],
            ['Cylinder Volume', 'Volume of cylinder = πr²h'],
            ['Heron’s Semi-perimeter', 's = (a + b + c) / 2'],
            ['Mean Formula', 'Mean = Sum / n'],
            ['Probability Formula', 'Probability = Favourable / Total']
        ],
        chemistry: [
            ['Matter in Our Surroundings', ''],
            ['Density Formula', 'ρ = m / V (m is mass; V is volume)'],
            ['Example density', '2.4 kg/L'],
            ['Matter definition', 'Anything that has mass and occupies space'],
            ['Diffusion definition', 'Mixing of particles on their own'],
            ['Evaporation definition', 'Liquid → gas change occurring at the surface'],
            ['Boiling definition', 'Liquid → gas change at a fixed temperature'],
            ['', ''],
            ['Is Matter Around Us Pure', ''],
            ['Concentration (Molarity)', 'M = n / V (n is moles, V is volume in Liters)'],
            ['Example Molarity', 'n = 1.2 mol, V = 0.8 L → M = 1.2 / 0.8 = 1.5 mol/L'],
            ['Mixture definition', 'Physical combination of two or more substances'],
            ['Solution definition', 'Homogeneous mixture of two or more substances'],
            ['Solute definition', 'Substance that is dissolved in a solution'],
            ['Solvent definition', 'Substance that dissolves the solute'],
            ['Suspension definition', 'Heterogeneous mixture in which particles settle down'],
            ['Colloid definition', 'Intermediate mixture with particles larger than solution but smaller than suspension'],
            ['', ''],
            ['Atoms and Molecules', ''],
            ['Number of moles (n)', 'n = m / M (Given mass / Molar mass)'],
            ['Number of particles (N)', 'N = n × 6.022 × 10²³ (n × Avogadro number)'],
            ['Atom definition', 'Smallest unit of an element that retains its properties'],
            ['Molecule definition', 'Group of two or more atoms chemically bonded together'],
            ['Mole definition', 'Amount of substance containing exactly 6.022 × 10²³ particles'],
            ['Molar Mass definition', 'The mass of one mole of a substance'],
            ['', ''],
            ['Structure of Atom', ''],
            ['Atomic Number (Z)', 'Z = Number of protons'],
            ['Mass Number (A)', 'A = Protons + Neutrons'],
            ['Neutrons Formula', 'Neutrons = A − Z'],
            ['Proton definition', 'Positively charged subatomic particle'],
            ['Electron definition', 'Negatively charged subatomic particle'],
            ['Neutron definition', 'Neutral subatomic particle'],
            ['Valency definition', 'The combining capacity of an atom'],
            ['', ''],
            ['Chemical Reactions & Equations', ''],
            ['General Form', 'Reactants → Products'],
            ['Example 1', '2H₂ + O₂ → 2H₂O'],
            ['Example 2', 'Zn + HCl → ZnCl₂ + H₂'],
            ['Chemical Reaction', 'Process that leads to chemical transformation of substances'],
            ['Balanced Equation', 'Equation with equal number of atoms of each element on both sides'],
            ['Combination Reaction', 'Reaction where two or more reactants form one product (A + B → AB)'],
            ['Decomposition Reaction', 'Reaction where one reactant breaks down into two or more products (AB → A + B)'],
            ['Displacement Reaction', 'Reaction where a more reactive element displaces a less reactive one (A + BC → AC + B)'],
            ['', ''],
            ['Laws of Chemical Combination', ''],
            ['Law of Conservation of Mass', 'Mass can neither be created nor destroyed in a chemical reaction'],
            ['Law of Constant Proportion', 'A chemical compound always contains same elements in fixed ratio by mass'],
            ['', ''],
            ['States of Matter (Gas Laws)', ''],
            ['Ideal Gas Law', 'PV = nRT (P=pressure, V=volume, n=moles, R=gas constant, T=temp)'],
            ['Charles Law', 'V₁ / T₁ = V₂ / T₂ (At constant pressure)'],
            ['Example Charles Law', 'State 1: 300 K, 12 L → State 2: 450 K, 18 L'],
            ['Pressure definition', 'Force acting per unit area'],
            ['Temperature definition', 'A measure of the average kinetic energy of particles'],
            ['Gas definition', 'State of matter with no fixed shape or volume'],
            ['', ''],
            ['Important Chemical Formulas', ''],
            ['Water', 'H₂O'],
            ['Carbon dioxide', 'CO₂'],
            ['Oxygen', 'O₂'],
            ['Hydrogen', 'H₂'],
            ['Sodium chloride', 'NaCl'],
            ['Ammonia', 'NH₃'],
            ['Methane', 'CH₄'],
            ['Sulphuric acid', 'H₂SO₄'],
            ['Nitric acid', 'HNO₃'],
            ['Calcium carbonate', 'CaCO₃'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['Density Formula', 'Density = m / V'],
            ['Molarity Formula', 'Molarity = n / V'],
            ['Moles Formula', 'n = m / M'],
            ['Particle Count', 'N = n × 6.022 × 10²³'],
            ['Atomic Number', 'Atomic Number = Protons'],
            ['Mass Number', 'Mass Number = Protons + Neutrons'],
            ['Ideal Gas Equation', 'PV = nRT'],
            ['Charles Law Formula', 'V₁/T₁ = V₂/T₂']
        ]
    },
    10: {
        physics: [
            ['Light (Reflection)', ''],
            ['Mirror Formula', '1/f = 1/u + 1/v (f = focal length, u = object distance, v = image distance)'],
            ['Magnification (m)', 'm = hᵢ / h₀ = −v/u (hᵢ = image height, h₀ = object height)'],
            ['Example Mirror', 'u = object dist, v ≈ 28cm, magnification m ≈ -1 for Concave Mirror'],
            ['Reflection definition', 'The bouncing back of light rays when they hit a surface'],
            ['Image definition', 'Visual representation formed by reflection of light rays'],
            ['Real Image definition', 'An image that can be obtained on a screen (formed by actual intersection of rays)'],
            ['Virtual Image definition', 'An image that cannot be obtained on a screen (formed by apparent intersection of rays)'],
            ['', ''],
            ['Light (Refraction)', ''],
            ['Lens Formula', '1/f = 1/v − 1/u (f = focal length, u = object distance, v = image distance)'],
            ['Lens Magnification (m)', 'm = hᵢ / h₀ = v/u'],
            ['Example Lens', 'do = object dist, di ≈ 32cm, magnification m ≈ -1 for Converging Lens'],
            ['Refraction definition', 'The bending of light rays when they pass from one medium to another'],
            ['Lens definition', 'A piece of transparent material that refracts light to form images'],
            ['Convex Lens', 'A lens that converges parallel rays of light'],
            ['Concave Lens', 'A lens that diverges parallel rays of light'],
            ['', ''],
            ['Human Eye', ''],
            ['Retina definition', 'Light-sensitive screen inside the eye where images are formed'],
            ['Myopia (Nearsightedness)', 'Defect where a person cannot see distant objects clearly'],
            ['Hypermetropia (Farsightedness)', 'Defect where a person cannot see nearby objects clearly'],
            ['', ''],
            ['Electricity', ''],
            ['Ohm’s Law', 'V = IR (V = potential difference, I = current, R = resistance)'],
            ['Electric Current', 'I = V / R (Example: V=12V, R=6Ω → I = 12/6 = 2A)'],
            ['Electric Power (P)', 'P = VI'],
            ['Power Formula (Current/Resistance)', 'P = I²R'],
            ['Power Formula (Voltage/Resistance)', 'P = V² / R'],
            ['Current definition', 'The rate of flow of electric charge'],
            ['Voltage definition', 'Work done to move a unit charge between two points'],
            ['Resistance definition', 'The property of a conductor to oppose the flow of current'],
            ['', ''],
            ['Combination of Resistors', ''],
            ['Series Resistance', 'R_total = R₁ + R₂ + R₃ + …'],
            ['Example Series', 'R₁=8Ω, R₂=8Ω, R₃=8Ω → R_total = 24Ω (at 12V, I = 0.5A)'],
            ['Parallel Resistance', '1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + …'],
            ['Example Parallel', 'R₁=8Ω, R₂=8Ω, R₃=8Ω → R_total = 2.67Ω (at 12V, I_total = 4.5A)'],
            ['Series Circuit', 'Circuit in which the same current flows through all components'],
            ['Parallel Circuit', 'Circuit in which the same voltage exists across all components'],
            ['', ''],
            ['Magnetic Effects of Current', ''],
            ['Magnetic Field', 'Region around a magnet where magnetic force is experienced'],
            ['Electromagnet', 'A temporary magnet formed by passing electric current through a coil'],
            ['Right-Hand Thumb Rule', 'Thumb points to current, fingers wrap in direction of magnetic field'],
            ['', ''],
            ['Electromagnetic Induction', ''],
            ['Induced Current', 'Current produced in a conductor due to a changing magnetic field'],
            ['Electric Generator', 'Device that converts mechanical energy into electrical energy'],
            ['', ''],
            ['Sources of Energy', ''],
            ['Renewable Energy', 'Energy sources that can be replenished naturally (solar, wind, hydro)'],
            ['Non-renewable Energy', 'Limited energy sources that cannot be replenished (coal, petroleum)'],
            ['', ''],
            ['Work, Energy and Power (Revision)', ''],
            ['Work Formula', 'Work = Force × Distance (W = Fd)'],
            ['Power Formula', 'Power = Work / Time'],
            ['Potential Energy', 'PE = mgh (g ≈ 9.8 m/s²)'],
            ['Kinetic Energy', 'KE = ½mv²'],
            ['Energy definition', 'The capacity to do work'],
            ['Work definition', 'Done when a force causes displacement of an object'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['Mirror Formula', '1/f = 1/u + 1/v'],
            ['Magnification', 'm = hᵢ / h₀'],
            ['Ohm’s Law', 'V = IR'],
            ['Electric Power 1', 'P = VI'],
            ['Electric Power 2', 'P = I²R'],
            ['Electric Power 3', 'P = V²/R'],
            ['Series Resistance', 'R_total = R₁ + R₂'],
            ['Parallel Resistance', '1/R_total = 1/R₁ + 1/R₂'],
            ['Potential Energy', 'PE = mgh'],
            ['Kinetic Energy', 'KE = ½mv²']
        ],
        maths: [
            ['Real Numbers', ''],
            ['HCF & LCM Relationship', 'HCF × LCM = Product of two numbers'],
            ['Euclid’s Division Lemma', 'a = bq + r (where 0 ≤ r < b)'],
            ['HCF definition', 'Highest common factor among given numbers'],
            ['LCM definition', 'Least common multiple among given numbers'],
            ['', ''],
            ['Polynomials', ''],
            ['Remainder Theorem', 'If polynomial p(x) is divided by (x − a), the remainder is p(a)'],
            ['Factor Theorem', 'If p(a) = 0, then (x − a) is a factor of p(x)'],
            ['Polynomial definition', 'An algebraic expression consisting of variables and coefficients'],
            ['Zero of Polynomial', 'A real number k is a zero of polynomial p(x) if p(k) = 0'],
            ['', ''],
            ['Pair of Linear Equations', ''],
            ['General Form Equations', 'a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0'],
            ['Consistent System', 'A system of linear equations that has at least one solution'],
            ['Inconsistent System', 'A system of linear equations that has no solution'],
            ['', ''],
            ['Quadratic Equations', ''],
            ['Standard Form', 'ax² + bx + c = 0 (where a ≠ 0)'],
            ['Quadratic Formula', 'x = (−b ± √(b² − 4ac)) / 2a'],
            ['Discriminant (D)', 'D = b² − 4ac'],
            ['Nature of Roots (D > 0)', 'Two distinct real roots'],
            ['Nature of Roots (D = 0)', 'Two equal real roots'],
            ['Nature of Roots (D < 0)', 'No real roots'],
            ['Quadratic Equation definition', 'An equation of degree 2'],
            ['Roots', 'The values of x that satisfy the quadratic equation'],
            ['', ''],
            ['Arithmetic Progressions (AP)', ''],
            ['nth Term of AP', 'aₙ = a + (n − 1)d'],
            ['Sum of first n Terms (Sₙ)', 'Sₙ = n/2 [2a + (n − 1)d]'],
            ['Sum with Last Term (l)', 'Sₙ = n/2 (a + l)'],
            ['AP definition', 'A sequence of numbers in which the difference between consecutive terms is constant'],
            ['Common Difference (d)', 'The constant difference between consecutive terms of an AP (d = aₙ − aₙ₋₁)'],
            ['', ''],
            ['Triangles', ''],
            ['Pythagoras Theorem', 'a² + b² = c² (where c is hypotenuse, a & b are other sides)'],
            ['Similar Triangles', 'Triangles with the same shape but different sizes (ratio of sides is equal)'],
            ['Congruent Triangles', 'Triangles with the same shape and same size'],
            ['', ''],
            ['Coordinate Geometry', ''],
            ['Distance Formula', 'd = √[(x₂ − x₁)² + (y₂ − y₁)²]'],
            ['Section Formula', 'Coordinates = [(mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n)]'],
            ['Midpoint Formula', 'Coordinates = [(x₁ + x₂)/2, (y₁ + y₂)/2]'],
            ['Coordinates definition', 'Set of values showing exact position of a point on a grid'],
            ['Origin Coordinate', '(0, 0)'],
            ['', ''],
            ['Trigonometry', ''],
            ['sine Ratio', 'sinθ = Perpendicular / Hypotenuse'],
            ['cosine Ratio', 'cosθ = Base / Hypotenuse'],
            ['tangent Ratio', 'tanθ = Perpendicular / Base'],
            ['Identity 1', 'sin²θ + cos²θ = 1'],
            ['Identity 2', '1 + tan²θ = sec²θ'],
            ['Identity 3', '1 + cot²θ = cosec²θ'],
            ['Trigonometry definition', 'The study of relationships between side lengths and angles of triangles'],
            ['Angle definition', 'The measure of rotation of a ray from its initial to terminal position'],
            ['', ''],
            ['Heights and Distances', ''],
            ['Trig Relationship', 'tanθ = Height / Distance'],
            ['Angle of Elevation', 'The angle formed by the line of sight with the horizontal when looking upward'],
            ['Angle of Depression', 'The angle formed by the line of sight with the horizontal when looking downward'],
            ['', ''],
            ['Circles', ''],
            ['Radius and Tangent', 'Tangent at any point is ⟂ to the radius through the point of contact'],
            ['Tangents from External Point', 'The lengths of tangents drawn from an external point to a circle are equal'],
            ['Tangent definition', 'A straight line that touches the circle boundary at exactly one point'],
            ['Chord definition', 'A line segment joining any two points on the circle boundary'],
            ['', ''],
            ['Areas Related to Circles', ''],
            ['Area of Circle', 'Area = πr²'],
            ['Circumference', 'C = 2πr'],
            ['Area of Sector', 'Area = (θ/360) × πr² (where θ is sector angle)'],
            ['Length of Arc', 'Length = (θ/360) × 2πr'],
            ['Sector definition', 'The portion of a circle enclosed by two radii and an arc'],
            ['Arc definition', 'A continuous portion of the circumference of a circle'],
            ['', ''],
            ['Surface Areas and Volumes', ''],
            ['Cone Volume', 'Volume = (1/3)πr²h'],
            ['Cone Curved Surface Area', 'CSA = πrl (where l is slant height)'],
            ['Sphere Surface Area', 'Surface Area = 4πr²'],
            ['Sphere Volume', 'Volume = (4/3)πr³'],
            ['Cylinder Volume', 'Volume = πr²h'],
            ['Cylinder Curved Surface Area', 'CSA = 2πrh'],
            ['Radius definition', 'Distance from center of sphere/cylinder to its boundary'],
            ['Height definition', 'The vertical distance from base to top'],
            ['', ''],
            ['Statistics', ''],
            ['Mean (Grouped Data)', 'Mean = Σfx / Σf'],
            ['Frequency definition', 'The number of times a particular value occurs'],
            ['Grouped Data definition', 'Data sorted and organized into classes or intervals'],
            ['', ''],
            ['Probability', ''],
            ['Probability Formula', 'Probability = Favourable outcomes / Total outcomes'],
            ['Event definition', 'One or more outcomes of an experiment'],
            ['Experiment definition', 'An operation or process that can produce some well-defined outcomes'],
            ['', ''],
            ['Final Quick Revision List', ''],
            ['Quadratic Formula', 'x = (−b ± √(b² − 4ac)) / 2a'],
            ['nth Term of AP', 'aₙ = a + (n−1)d'],
            ['Sum of AP Terms', 'Sₙ = n/2 [2a + (n−1)d]'],
            ['Distance Formula', 'Distance = √[(x₂−x₁)² + (y₂−y₁)²]'],
            ['Trig Identity', 'sin²θ + cos²θ = 1'],
            ['Circle Area', 'Area = πr²'],
            ['Cone Volume', 'Volume = (1/3)πr²h'],
            ['Mean Formula', 'Mean = Σfx / Σf'],
            ['Probability Formula', 'Probability = Favourable / Total']
        ],
        chemistry: [
            ['Stoichiometry (intro)', 'Moles = mass / molar mass']
        ]
    }
};

// show detailed formulas for a subject and class
function showNotes(subject) {
    if (!subject) return;
    const params = parseQueryParams();
    const cls = params.classNumber || null;
    const s = String(subject).toLowerCase();
    const contentEl = document.getElementById('content');
    if (!contentEl) return;
    const header = s.charAt(0).toUpperCase() + s.slice(1);
    let out = `<h2>${header} Notes${cls ? ' - Class ' + cls : ''}</h2>`;
    const list = (cls && FORMULAS[cls] && FORMULAS[cls][s]) || [];
    if (list.length === 0) {
        out += `<p>No formulas available yet for ${header}${cls ? ' (Class ' + cls + ')' : ''}.</p>`;
    } else {
        out += '<ul class="formula-list">';
        for (const f of list) {
            out += `<li><strong>${f[0]}:</strong> ${f[1]}</li>`;
        }
        out += '</ul>';
    }
    contentEl.innerHTML = out;
}

const DARK_MODE_KEY = "formulanestDarkMode";

function getStoredDarkMode() {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    return saved === null ? true : saved === "true";
}

function applyThemeFromStorage() {
    const isDark = getStoredDarkMode();
    document.body.classList.toggle("light-theme", !isDark);
}

function setDarkModePreference(isDark) {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
    applyThemeFromStorage();
}

if (typeof window !== "undefined") {
    window.FormulaNestTheme = {
        applyThemeFromStorage,
        setDarkModePreference,
        getStoredDarkMode
    };
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() { applyThemeFromStorage(); initNotesPage(); initDarkToggle(); initSharePanel(); });
    } else {
        applyThemeFromStorage(); initNotesPage(); initDarkToggle(); initSharePanel();
    }
}

function initSharePanel() {
    const openBtn = document.getElementById("share-open-btn");
    const closeBtn = document.getElementById("share-close-btn");
    const copyBtn = document.getElementById("share-copy-btn");
    const messageCopyBtn = document.getElementById("share-message-copy-btn");
    const whatsAppBtn = document.getElementById("share-whatsapp-btn");
    const progressCardBtn = document.getElementById("share-progress-card-btn");
    const cardPageLink = document.getElementById("share-card-page-link");
    const dialog = document.getElementById("share-dialog");
    const linkInput = document.getElementById("share-link");
    const publicLinkInput = document.getElementById("share-public-link");
    const messageInput = document.getElementById("share-message");
    const qrImg = document.getElementById("share-qr");
    const progressCardPreview = document.getElementById("share-progress-card-preview");
    const progressCardCanvas = document.getElementById("share-progress-card-canvas");
    const modeButtons = document.querySelectorAll("[data-share-mode]");

    if (!openBtn || !dialog || !linkInput || !messageInput || !qrImg) {
        return;
    }

    let currentMode = "app";
    const PUBLIC_SHARE_KEY = "formulanestPublicShareLink";

    function getBaseUrl(path) {
        if (!window.location.origin || window.location.origin === "null") {
            return new URL(path, "http://localhost:3000/").toString();
        }
        return new URL(path, window.location.href).toString();
    }

    function getPublicBaseUrl() {
        const saved = (publicLinkInput && publicLinkInput.value ? publicLinkInput.value : "").trim();
        if (!saved) {
            return "";
        }

        try {
            const url = new URL(saved);
            if (url.protocol !== "https:" && url.protocol !== "http:") {
                return "";
            }
            if (/\.[a-z0-9]+$/i.test(url.pathname)) {
                return new URL("./", url.href).toString();
            }
            return `${url.origin}${url.pathname.replace(/\/$/, "")}/`;
        } catch (error) {
            return "";
        }
    }

    function getShareUrl(path) {
        const publicBase = getPublicBaseUrl();
        if (publicBase) {
            return new URL(path, publicBase).toString();
        }
        return getBaseUrl(path);
    }

    function getQuizSummaryText() {
        const stats = loadParentStats();
        const quizKeys = stats.quizzes ? Object.keys(stats.quizzes) : [];
        if (!quizKeys.length) {
            return "No quiz result is saved yet.";
        }

        return quizKeys.sort(function (a, b) {
            return Number(a) - Number(b);
        }).map(function (key) {
            const entry = stats.quizzes[key] || {};
            const score = typeof entry.score === "number" && typeof entry.total === "number"
                ? `${entry.score}/${entry.total}`
                : "not scored";
            const when = entry.savedAt ? formatSessionTime(entry.savedAt) : "recently";
            return `Class ${key}: ${score} (${when})`;
        }).join("\n");
    }

    function getRecentSessionText() {
        const history = loadSessionHistory();
        if (!history.length) {
            return "No recent session is saved yet.";
        }

        return history.slice(0, 3).map(function (entry) {
            return `Class ${entry.classNumber} - ${getSessionSubjectLabel(entry.subject)} (${formatSessionTime(entry.savedAt)})`;
        }).join("\n");
    }

    function getLatestQuizResult() {
        const stats = loadParentStats();
        const quizKeys = stats.quizzes ? Object.keys(stats.quizzes) : [];
        if (!quizKeys.length) {
            return null;
        }

        return quizKeys.map(function (key) {
            const entry = stats.quizzes[key] || {};
            return {
                classNumber: key,
                score: typeof entry.score === "number" ? entry.score : null,
                total: typeof entry.total === "number" ? entry.total : null,
                savedAt: entry.savedAt || 0
            };
        }).sort(function (a, b) {
            return Number(b.savedAt || 0) - Number(a.savedAt || 0);
        })[0];
    }

    function getProgressCardData() {
        const stats = loadParentStats();
        const history = loadSessionHistory();
        const latestQuiz = getLatestQuizResult();
        const last = stats.lastActivity || null;

        return {
            studentName: "Ashish",
            latestQuiz,
            lastActivity: last,
            quizSummary: getQuizSummaryText(),
            recentSessions: history.slice(0, 3),
            progressUrl: getShareUrl("parent.html?v=67"),
            generatedAt: new Date()
        };
    }

    function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
        const words = String(text || "").split(/\s+/).filter(Boolean);
        let line = "";
        let lines = [];

        words.forEach(function (word) {
            const test = line ? `${line} ${word}` : word;
            if (ctx.measureText(test).width > maxWidth && line) {
                lines.push(line);
                line = word;
                return;
            }
            line = test;
        });

        if (line) {
            lines.push(line);
        }

        if (maxLines && lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
            lines[lines.length - 1] = lines[lines.length - 1].replace(/\s+\S*$/, "") + "...";
        }

        lines.forEach(function (item, index) {
            ctx.fillText(item, x, y + index * lineHeight);
        });

        return y + lines.length * lineHeight;
    }

    function drawProgressCard() {
        if (!progressCardCanvas || !progressCardCanvas.getContext) {
            return;
        }

        const data = getProgressCardData();
        const ctx = progressCardCanvas.getContext("2d");
        const width = progressCardCanvas.width;
        const height = progressCardCanvas.height;
        const latest = data.latestQuiz;
        const percent = latest && latest.total ? Math.round((latest.score / latest.total) * 100) : 0;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#07111f";
        ctx.fillRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#0f766e");
        gradient.addColorStop(0.55, "#0f172a");
        gradient.addColorStop(1, "#172554");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.arc(920, 170, 230, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(110, 1130, 280, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(15,23,42,0.72)";
        roundRect(ctx, 70, 70, width - 140, height - 140, 36);
        ctx.fill();

        ctx.fillStyle = "#67e8f9";
        ctx.font = "700 34px Trebuchet MS, Arial";
        ctx.fillText("FormulaNest", 110, 145);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "700 78px Trebuchet MS, Arial";
        drawWrappedText(ctx, `${data.studentName}'s Progress Report`, 110, 250, 760, 86, 2);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "500 30px Trebuchet MS, Arial";
        const generated = data.generatedAt.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
        ctx.fillText(`Generated ${generated}`, 110, 405);

        ctx.fillStyle = "#22d3ee";
        roundRect(ctx, 110, 465, 860, 210, 28);
        ctx.fill();
        ctx.fillStyle = "#082f49";
        ctx.font = "700 34px Trebuchet MS, Arial";
        ctx.fillText("Latest Quiz", 145, 525);
        ctx.font = "700 72px Trebuchet MS, Arial";
        const hasScore = latest && typeof latest.score === "number" && typeof latest.total === "number";
        ctx.fillText(hasScore ? `${latest.score}/${latest.total}` : "No score", 145, 610);
        ctx.font = "700 38px Trebuchet MS, Arial";
        ctx.fillText(hasScore ? `Class ${latest.classNumber} - ${percent}%` : "Finish a quiz to start tracking", 520, 600);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "700 34px Trebuchet MS, Arial";
        ctx.fillText("Last Activity", 110, 755);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "500 30px Trebuchet MS, Arial";
        const lastText = data.lastActivity
            ? `Class ${data.lastActivity.classNumber || "-"} - ${getSessionSubjectLabel(data.lastActivity.subject || "")} - ${formatSessionTime(data.lastActivity.savedAt)}`
            : "No activity saved yet.";
        drawWrappedText(ctx, lastText, 110, 805, 830, 38, 2);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "700 34px Trebuchet MS, Arial";
        ctx.fillText("Recent Sessions", 110, 930);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "500 28px Trebuchet MS, Arial";
        if (data.recentSessions.length) {
            data.recentSessions.forEach(function (entry, index) {
                const text = `Class ${entry.classNumber} - ${getSessionSubjectLabel(entry.subject)} - ${formatSessionTime(entry.savedAt)}`;
                drawWrappedText(ctx, text, 130, 982 + index * 48, 800, 34, 1);
            });
        } else {
            ctx.fillText("No recent sessions saved yet.", 130, 982);
        }

        ctx.fillStyle = "#94a3b8";
        ctx.font = "500 26px Trebuchet MS, Arial";
        drawWrappedText(ctx, data.progressUrl, 110, 1210, 820, 34, 2);
    }

    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    }

    function getShareDetails() {
        const appUrl = getShareUrl("index.html?v=70");
        const practiceUrl = getShareUrl("practice.html?v=67");
        const progressUrl = getShareUrl("parent.html?v=67");

        if (currentMode === "practice") {
            return {
                url: practiceUrl,
                message: [
                    "FormulaNest practice invite",
                    "Open this link and choose your class quiz.",
                    practiceUrl,
                    "",
                    "Daily 5 is also available from the home page."
                ].join("\n")
            };
        }

        if (currentMode === "progress") {
            return {
                url: progressUrl,
                message: [
                    "FormulaNest progress report",
                    "Latest quiz results:",
                    getQuizSummaryText(),
                    "",
                    "Recent sessions:",
                    getRecentSessionText(),
                    "",
                    `Open dashboard: ${progressUrl}`
                ].join("\n")
            };
        }

        return {
            url: appUrl,
            message: [
                "Open FormulaNest",
                "A class 6 to 10 formula, notes, practice, and progress app.",
                appUrl
            ].join("\n")
        };
    }

    function copyText(text, fallbackElement) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).catch(function () {
                if (fallbackElement) {
                    fallbackElement.select();
                    document.execCommand("copy");
                }
            });
        }

        if (fallbackElement) {
            fallbackElement.select();
            document.execCommand("copy");
        }

        return Promise.resolve();
    }

    function syncSharePanel() {
        const details = getShareDetails();
        linkInput.value = details.url;
        messageInput.value = details.message;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(details.url)}`;
        const isProgressMode = currentMode === "progress";

        if (progressCardPreview) {
            progressCardPreview.hidden = !isProgressMode;
        }

        if (progressCardBtn) {
            progressCardBtn.disabled = !isProgressMode;
        }

        if (isProgressMode) {
            drawProgressCard();
        }

        if (cardPageLink) {
            const cardUrl = new URL(getShareUrl("share.html"));
            cardUrl.searchParams.set("name", "Ashish");
            cardUrl.searchParams.set("about", "FormulaNest is a Class 6 to 10 formula app for notes, quizzes, practice, and progress sharing.");
            cardUrl.searchParams.set("details", currentMode === "progress" ? getQuizSummaryText() : "Share this app with students, parents, or classmates.");
            cardUrl.searchParams.set("app", details.url);
            cardPageLink.href = cardUrl.toString();
        }
    }

    function openDialog() {
        syncSharePanel();
        dialog.classList.add("is-open");
        dialog.setAttribute("aria-hidden", "false");
    }

    function closeDialog() {
        dialog.classList.remove("is-open");
        dialog.setAttribute("aria-hidden", "true");
    }

    openBtn.addEventListener("click", openDialog);
    if (publicLinkInput) {
        publicLinkInput.value = localStorage.getItem(PUBLIC_SHARE_KEY) || "";
        publicLinkInput.addEventListener("input", function () {
            localStorage.setItem(PUBLIC_SHARE_KEY, publicLinkInput.value.trim());
            syncSharePanel();
        });
    }

    modeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            currentMode = button.getAttribute("data-share-mode") || "app";
            modeButtons.forEach(function (item) {
                item.classList.toggle("is-active", item === button);
            });
            syncSharePanel();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeDialog);
    }

    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            closeDialog();
        }
    });

    if (copyBtn) {
        copyBtn.addEventListener("click", function () {
            copyText(linkInput.value, linkInput);
        });
    }

    if (messageCopyBtn) {
        messageCopyBtn.addEventListener("click", function () {
            copyText(messageInput.value, messageInput);
        });
    }

    if (whatsAppBtn) {
        whatsAppBtn.addEventListener("click", function () {
            const message = encodeURIComponent(messageInput.value || getShareDetails().message);
            window.location.href = `https://api.whatsapp.com/send?text=${message}`;
        });
    }

    if (progressCardBtn) {
        progressCardBtn.addEventListener("click", function () {
            currentMode = "progress";
            syncSharePanel();
            if (!progressCardCanvas) {
                return;
            }
            const link = document.createElement("a");
            link.download = "formulanest-progress-card.png";
            link.href = progressCardCanvas.toDataURL("image/png");
            link.click();
        });
    }

    linkInput.value = getShareUrl("index.html?v=70");
    messageInput.value = "Open FormulaNest\nA class 6 to 10 formula, notes, practice, and progress app.";
}

let currentSubject = null;
let currentViewMode = localStorage.getItem("formulanestViewMode") || "attractive";
let currentQuiz = null;
let quizTimerId = null;
let quizTimeLeft = 15;
const LAST_CELEBRATION_KEY = "formulanestLastCelebration";
let hasRestoredCelebrationThisPage = false;
let calculatorExpression = "";
const SESSION_HISTORY_KEY = "formulanestSessionHistory";
const MAX_SESSION_HISTORY = 12;
let isRestoringSession = false;
const PARENT_STATS_KEY = "formulanestParentStats";
let currentUtterance = null;
const MISTAKE_TRACKER_KEY = "formulanestMistakeTracker";

function loadMistakeTracker() {
    const raw = localStorage.getItem(MISTAKE_TRACKER_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(function (item) {
            return item && typeof item.question === "string" && typeof item.topic === "string";
        });
    } catch (error) {
        return [];
    }
}

function saveMistakeTracker(items) {
    const limited = Array.isArray(items) ? items.slice(0, 120) : [];
    localStorage.setItem(MISTAKE_TRACKER_KEY, JSON.stringify(limited));
}

function classifyQuestionTopic(question) {
    const text = String(question || "").toLowerCase();

    if (/(speed|distance|time|motion|velocity|acceleration)/.test(text)) {
        return "Motion and speed";
    }
    if (/(force|work|power|energy|gravity|friction|weight|pressure|density)/.test(text)) {
        return "Force, work and energy";
    }
    if (/(light|shadow|reflection|mirror)/.test(text)) {
        return "Light";
    }
    if (/(heat|temperature)/.test(text)) {
        return "Heat and temperature";
    }
    if (/(electric|current|voltage|resistance|circuit|ohm)/.test(text)) {
        return "Electricity";
    }
    if (/(fraction|ratio|percentage|proportion|profit|loss|discount|interest|mean)/.test(text)) {
        return "Arithmetic and finance";
    }
    if (/(area|perimeter|circle|triangle|square|volume|geometry|algebra|sqrt|\^|x\s*[+\-*/])/i.test(text)) {
        return "Maths and geometry";
    }
    if (/(acid|base|compound|element|mixture|atom|molecule|mole|solution|solute|solvent|h2o|co2|nacl|hcl|naoh)/.test(text)) {
        return "Chemistry";
    }

    return "Mixed practice";
}

function recordQuizMistakes(classNumber, questions, responses) {
    const nextEntries = loadMistakeTracker();
    const savedAt = Date.now();

    (questions || []).forEach(function (question, index) {
        const selectedIndex = responses ? responses[index] : null;
        if (selectedIndex === question.answer) {
            return;
        }

        nextEntries.unshift({
            classNumber: String(classNumber || ""),
            question: question.question,
            correctAnswer: question.options[question.answer],
            selectedAnswer: selectedIndex === null || selectedIndex === undefined ? "Did not attend" : question.options[selectedIndex],
            topic: classifyQuestionTopic(question.question),
            savedAt: savedAt
        });
    });

    saveMistakeTracker(nextEntries);
}

function summarizeMistakeTopics(classNumber, limit) {
    const maxItems = typeof limit === "number" ? limit : 5;
    const tracker = loadMistakeTracker();
    const scoped = classNumber ? tracker.filter(function (item) {
        return String(item.classNumber || "") === String(classNumber || "");
    }) : tracker;
    const source = scoped.length ? scoped : tracker;
    const counts = {};

    source.forEach(function (item) {
        const topic = item.topic || "Mixed practice";
        counts[topic] = (counts[topic] || 0) + 1;
    });

    return Object.keys(counts)
        .sort(function (a, b) {
            return counts[b] - counts[a];
        })
        .slice(0, maxItems)
        .map(function (topic) {
            return { topic: topic, count: counts[topic] };
        });
}

function getLatestQuizClassFromStats(stats) {
    const quizEntries = stats && stats.quizzes ? Object.keys(stats.quizzes) : [];
    if (!quizEntries.length) {
        return "";
    }

    const latest = quizEntries
        .map(function (classNumber) {
            const entry = stats.quizzes[classNumber] || {};
            return {
                classNumber: String(classNumber || ""),
                savedAt: entry.savedAt || 0
            };
        })
        .sort(function (a, b) {
            return b.savedAt - a.savedAt;
        })[0];

    return latest ? latest.classNumber : "";
}

function buildWeakTopicQuizPool(classNumber, classPool) {
    const weakTopics = summarizeMistakeTopics(classNumber, 5).map(function (item) {
        return item.topic;
    });

    if (!weakTopics.length) {
        return classPool;
    }

    const filtered = (classPool || []).filter(function (entry) {
        return weakTopics.some(function (topic) {
            return classifyQuestionTopic(entry[0]) === topic;
        });
    });

    return filtered.length >= 10 ? filtered : classPool;
}

function openWeakTopicRevision(classNumber) {
    const cls = String(classNumber || "").trim();
    if (!cls) {
        return;
    }

    window.location.href = `notes.html?class=${encodeURIComponent(cls)}&quiz=1&mode=weak`;
}

function getVisualLearningCards(subject) {
    const topic = String(subject || "").toLowerCase();

    const cardSets = {
        physics: [
            {
                title: "Speed Triangle",
                diagram: '<div class="visual-diagram triangle-diagram"><span class="diagram-top">D</span><div class="diagram-base"><span>V</span><span>T</span></div></div>',
                caption: "Cover distance, speed, or time to remember v = d / t."
            },
            {
                title: "Force Chain",
                diagram: '<div class="visual-diagram formula-diagram"><span>F</span><span class="diagram-symbol">=</span><span>m × a</span></div>',
                caption: "More mass or more acceleration means more force."
            },
            {
                title: "Reflection Rule",
                diagram: '<div class="visual-diagram angle-diagram"><span>i</span><span class="diagram-symbol">=</span><span>r</span></div>',
                caption: "The angle of incidence equals the angle of reflection."
            }
        ],
        maths: [
            {
                title: "Fraction Bar",
                diagram: '<div class="visual-diagram fraction-diagram"><span class="fraction-top">a</span><span class="fraction-bar"></span><span class="fraction-bottom">b</span></div>',
                caption: "The top number is the part; the bottom number is the whole."
            },
            {
                title: "Percentage Ladder",
                diagram: '<div class="visual-diagram formula-diagram"><span>Part</span><span class="diagram-symbol">÷</span><span>Whole × 100</span></div>',
                caption: "Use this to move from a fraction to a percentage."
            },
            {
                title: "Triangle Area",
                diagram: '<div class="visual-diagram formula-diagram"><span>1/2</span><span class="diagram-symbol">×</span><span>b × h</span></div>',
                caption: "Half the base times the height gives the area."
            }
        ],
        chemistry: [
            {
                title: "States of Matter",
                diagram: '<div class="visual-diagram stack-diagram"><span>Solid</span><span>Liquid</span><span>Gas</span></div>',
                caption: "Fixed shape, fixed volume, or free to flow."
            },
            {
                title: "Separation Flow",
                diagram: '<div class="visual-diagram formula-diagram"><span>Mixture</span><span class="diagram-symbol">→</span><span>Filter / Evaporate</span></div>',
                caption: "Choose the method based on the type of mixture."
            },
            {
                title: "Density Check",
                diagram: '<div class="visual-diagram formula-diagram"><span>m</span><span class="diagram-symbol">÷</span><span>V</span></div>',
                caption: "Density helps explain why some objects float and some sink."
            }
        ]
    };

    return cardSets[topic] || [];
}

function renderVisualLearningSection(subject) {
    const cards = getVisualLearningCards(subject);
    if (!cards.length) {
        return "";
    }

    const subjectName = String(subject || "").charAt(0).toUpperCase() + String(subject || "").slice(1);
    const items = cards.map(function (card) {
        return `
            <article class="visual-aid-card">
                <div class="visual-aid-title">${card.title}</div>
                ${card.diagram}
                <div class="visual-caption">${card.caption}</div>
            </article>
        `;
    }).join("");

    return `
        <section class="visual-learning-block">
            <h3>Visual Learning - ${subjectName}</h3>
            <div class="visual-aid-grid">${items}</div>
        </section>
    `;
}

function renderOverviewVisualLearning(classNumber) {
    const subjectOrder = ["physics", "maths", "chemistry"];
    const items = subjectOrder.map(function (subject) {
        const card = getVisualLearningCards(subject)[0];
        if (!card) {
            return "";
        }

        const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
        return `
            <article class="visual-aid-card">
                <div class="visual-aid-title">${subjectName} Quick View</div>
                ${card.diagram}
                <div class="visual-caption">${card.caption}</div>
            </article>
        `;
    }).join("");

    if (!items.trim()) {
        return "";
    }

    return `
        <section class="visual-learning-block">
            <h3>Visual Learning</h3>
            <div class="visual-aid-grid">${items}</div>
        </section>
    `;
}

function renderWeakTopicPanel(classNumber) {
    const topics = summarizeMistakeTopics(classNumber, 5);
    const safeClassNumber = String(classNumber || "");
    const buttonMarkup = safeClassNumber
        ? `<button class="quiz-btn secondary weak-revision-btn" onclick="openWeakTopicRevision(${JSON.stringify(safeClassNumber)})">Revise weak topics</button>`
        : "";

    if (!topics.length) {
        return `
            <div class="parent-card">
                <h3>Weak Topics</h3>
                <p>No mistakes tracked yet. Finish a quiz to build your revision list.</p>
                ${buttonMarkup}
            </div>
        `;
    }

    const items = topics.map(function (item) {
        return `
            <li>
                ${item.topic}
                <br><small>${item.count} missed answer${item.count === 1 ? "" : "s"}</small>
            </li>
        `;
    }).join("");

    return `
        <div class="parent-card">
            <h3>Weak Topics</h3>
            <ul class="parent-list">${items}</ul>
            ${buttonMarkup}
        </div>
    `;
}

function recordQuizInsights(computedScore, total) {
    if (!currentQuiz || currentQuiz.insightsSaved) {
        return;
    }

    currentQuiz.score = computedScore;
    recordQuizResult(currentQuiz.classNumber, computedScore, total);
    recordQuizMistakes(currentQuiz.classNumber, currentQuiz.questions, currentQuiz.responses);
    currentQuiz.insightsSaved = true;
}

const CLASS6_QUIZ_POOL = [
    ["What is speed?", ["d/t", "d*t", "t/d", "d+t"], 0],
    ["SI unit of length:", ["kg", "meter", "second", "litre"], 1],
    ["SI unit of time:", ["meter", "second", "kg", "ampere"], 1],
    ["Motion means:", ["rest", "change in position", "sleep", "stop"], 1],
    ["1 km = ?", ["100 m", "1000 m", "10 m", "500 m"], 1],
    ["Which is fastest?", ["cycle", "car", "plane", "bus"], 2],
    ["Distance is:", ["straight line", "total path covered", "speed", "time"], 1],
    ["Time = ?", ["d/speed", "d*s", "s/d", "t*d"], 0],
    ["Unit of speed:", ["m^2", "m/s", "kg", "N"], 1],
    ["Rest means:", ["moving", "no motion", "fast", "slow"], 1],
    ["Force is:", ["push/pull", "heat", "light", "sound"], 0],
    ["Unit of force:", ["Joule", "Newton", "Watt", "kg"], 1],
    ["Force can:", ["stop motion", "cook food", "shine", "freeze"], 0],
    ["Work = ?", ["F*d", "d/t", "m*a", "t/d"], 0],
    ["Unit of work:", ["Watt", "Joule", "Newton", "kg"], 1],
    ["Energy means:", ["power", "ability to do work", "motion", "rest"], 1],
    ["Work done when:", ["no motion", "object moves", "sleeping", "rest"], 1],
    ["Gravity is:", ["energy", "force", "heat", "light"], 1],
    ["Example of energy use:", ["sleeping", "running", "resting", "sitting"], 1],
    ["1 hour = ?", ["30 min", "60 min", "90 min", "120 min"], 1],
    ["1 min = ?", ["30 sec", "60 sec", "100 sec", "120 sec"], 1],
    ["SI unit of mass:", ["kg", "meter", "second", "litre"], 0],
    ["1 m = ?", ["10 cm", "100 cm", "1000 cm", "50 cm"], 1],
    ["1 cm = ?", ["1 mm", "10 mm", "100 mm", "5 mm"], 1],
    ["Speed formula:", ["d/t", "d*t", "t/d", "d+t"], 0],
    ["Distance formula:", ["s*t", "s/t", "t/s", "s+t"], 0],
    ["Time formula:", ["d/s", "d*s", "s/d", "s+t"], 0],
    ["If d=10, t=2 -> speed?", ["2", "5", "10", "20"], 1],
    ["Uniform speed means:", ["same speed", "changing speed", "stop", "fast"], 0],
    ["Non-uniform speed:", ["constant", "changing speed", "rest", "equal"], 1],
    ["Light travels in:", ["curve", "straight line", "zigzag", "circle"], 1],
    ["Source of light:", ["moon", "sun", "table", "book"], 1],
    ["Heat is:", ["matter", "energy", "force", "mass"], 1],
    ["Shadow forms when:", ["light passes", "light blocked", "dark", "heat"], 1],
    ["Mirror reflects:", ["heat", "light", "sound", "force"], 1],
    ["Transparent object:", ["wall", "glass", "wood", "iron"], 1],
    ["Opaque object:", ["glass", "wall", "air", "water"], 1],
    ["Heat flows from:", ["cold to hot", "hot to cold", "same", "none"], 1],
    ["Example of heat:", ["ice", "fire", "air", "stone"], 1],
    ["Electricity flows in:", ["open", "circuit", "air", "space"], 1],
    ["Source of electricity:", ["cell", "stone", "wood", "sand"], 0],
    ["Switch controls:", ["light", "current", "heat", "sound"], 1],
    ["Bulb glows when:", ["open circuit", "closed circuit", "no wire", "broken"], 1],
    ["Open circuit:", ["flow", "no flow", "fast", "slow"], 1],
    ["Closed circuit:", ["no flow", "flow", "stop", "break"], 1],
    ["Conductor:", ["rubber", "copper", "plastic", "wood"], 1],
    ["Insulator:", ["copper", "rubber", "iron", "silver"], 1],
    ["Wire carries:", ["heat", "current", "light", "air"], 1],
    ["Cell gives:", ["energy", "force", "heat", "sound"], 0],
    ["5*2 = ?", ["10", "8", "12", "6"], 0],
    ["10/2 = ?", ["2", "5", "10", "20"], 1],
    ["3*4 = ?", ["12", "10", "14", "8"], 0],
    ["12/3 = ?", ["4", "6", "3", "12"], 0],
    ["6*5 = ?", ["30", "20", "25", "15"], 0],
    ["20/4 = ?", ["5", "4", "6", "8"], 0],
    ["8*2 = ?", ["16", "14", "18", "12"], 0],
    ["15/3 = ?", ["5", "3", "6", "4"], 0],
    ["9*3 = ?", ["27", "21", "24", "18"], 0],
    ["18/6 = ?", ["3", "2", "6", "9"], 0],
    ["Walking is:", ["rest", "motion", "sleep", "stop"], 1],
    ["Sitting is:", ["motion", "rest", "speed", "force"], 1],
    ["Fan rotates:", ["rest", "motion", "heat", "light"], 1],
    ["Ball thrown:", ["rest", "motion", "sleep", "stop"], 1],
    ["Pushing door:", ["work", "force", "light", "sound"], 1],
    ["Lifting bag:", ["force", "work", "rest", "motion"], 1],
    ["Running uses:", ["energy", "rest", "stop", "sleep"], 0],
    ["Car moving:", ["speed", "rest", "stop", "sleep"], 0],
    ["Stone falling:", ["heat", "gravity", "light", "sound"], 1],
    ["Jumping:", ["force", "rest", "stop", "sleep"], 0],
    ["1 day = ?", ["12 hr", "24 hr", "48 hr", "36 hr"], 1],
    ["1 week = ?", ["5 days", "7 days", "10 days", "3 days"], 1],
    ["1 year = ?", ["200 days", "365 days", "100 days", "50 days"], 1],
    ["Speed is always:", ["negative", "positive", "zero", "none"], 1],
    ["Distance is:", ["negative", "positive", "zero", "none"], 1],
    ["Time is:", ["negative", "positive", "zero", "none"], 1],
    ["Faster means:", ["more time", "less time", "stop", "rest"], 1],
    ["Slower means:", ["less time", "more time", "stop", "rest"], 1],
    ["Big object has:", ["less mass", "more mass", "no mass", "zero"], 1],
    ["Small object has:", ["more mass", "less mass", "no mass", "zero"], 1],
    ["Unit of speed:", ["m/s", "m^2", "kg", "N"], 0],
    ["Unit of force:", ["Joule", "Newton", "Watt", "kg"], 1],
    ["Unit of work:", ["Joule", "Newton", "Watt", "kg"], 0],
    ["Unit of power:", ["Watt", "Joule", "Newton", "kg"], 0],
    ["Energy =", ["work ability", "rest", "stop", "none"], 0],
    ["Work =", ["F*d", "d/t", "t/d", "none"], 0],
    ["Speed =", ["d/t", "d*t", "t/d", "none"], 0],
    ["Distance =", ["s*t", "s/t", "t/s", "none"], 0],
    ["Time =", ["d/s", "d*s", "s/d", "none"], 0],
    ["Motion =", ["change position", "rest", "sleep", "none"], 0],
    ["Force changes:", ["motion", "rest", "sleep", "none"], 0],
    ["Energy unit:", ["Joule", "Watt", "Newton", "kg"], 0],
    ["Power =", ["work/time", "time/work", "force", "none"], 0],
    ["Light helps:", ["see objects", "sleep", "stop", "none"], 0],
    ["Heat makes:", ["warm", "cold", "dark", "none"], 0],
    ["Gravity pulls:", ["up", "down", "side", "none"], 1],
    ["Electricity needs:", ["circuit", "air", "heat", "none"], 0],
    ["Circuit must be:", ["open", "closed", "broken", "none"], 1],
    ["Conductor allows:", ["current flow", "stop", "block", "none"], 0],
    ["Insulator:", ["blocks current", "allows", "flows", "none"], 0],
    ["Science studies:", ["nature", "sleep", "rest", "none"], 0]
];

const CLASS7_QUIZ_POOL = [
    ["Work is equal to:", ["distance/time", "force x distance", "mass x acceleration", "speed x time"], 1],
    ["Unit of power:", ["Joule", "Newton", "Watt", "kg"], 2],
    ["Which is a force?", ["push", "heat", "light", "sound"], 0],
    ["Average speed is:", ["d*t", "t/d", "total distance / total time", "speed x time"], 2],
    ["Which has energy?", ["empty box", "moving car", "paper", "still stone"], 1],
    ["Work done is zero when:", ["object moves", "no movement", "force applied", "speed high"], 1],
    ["Unit of force:", ["Joule", "Newton", "Watt", "meter"], 1],
    ["Motion means:", ["rest", "change in position", "stop", "sleep"], 1],
    ["Power formula:", ["work/time", "time/work", "force x distance", "speed x time"], 0],
    ["Which shows motion?", ["sitting", "running", "sleeping", "resting"], 1],
    ["Energy unit:", ["Watt", "Joule", "Newton", "kg"], 1],
    ["Gravity pulls objects:", ["up", "down", "sideways", "none"], 1],
    ["Speed unit:", ["m/s", "kg", "Joule", "Newton"], 0],
    ["Distance unit:", ["second", "meter", "Watt", "Joule"], 1],
    ["Time unit:", ["kg", "meter", "second", "Joule"], 2],
    ["Heat is:", ["force", "energy", "mass", "speed"], 1],
    ["Light travels in:", ["curve", "straight line", "zigzag", "circle"], 1],
    ["Shadow forms when:", ["light passes", "light blocked", "heat present", "none"], 1],
    ["Transparent object:", ["wall", "glass", "wood", "iron"], 1],
    ["Opaque object:", ["air", "glass", "wall", "water"], 2],
    ["NOT a unit of energy:", ["Joule", "Watt", "calorie", "erg"], 1],
    ["Work is done when:", ["pushing wall", "lifting bag", "sitting", "sleeping"], 1],
    ["Non-uniform motion:", ["constant speed", "accelerating car", "steady fan", "earth rotation"], 1],
    ["Speed (20m, 4s):", ["4", "5", "6", "8"], 1],
    ["NOT a force:", ["friction", "gravity", "energy", "push"], 2],
    ["Maximum energy:", ["still stone", "moving bike", "empty box", "paper"], 1],
    ["Insulator:", ["copper", "rubber", "aluminum", "iron"], 1],
    ["Conductor:", ["plastic", "rubber", "copper", "wood"], 2],
    ["Measures time:", ["scale", "clock", "balance", "thermometer"], 1],
    ["Correct formula:", ["force = work/time", "work = force x distance", "power = force x distance", "speed = force/time"], 1],
    ["Uniform motion:", ["changing speed", "constant speed", "zero speed", "no motion"], 1],
    ["Uses energy:", ["sleeping", "running", "resting", "sitting"], 1],
    ["Fastest:", ["cycle", "car", "airplane", "train"], 2],
    ["Heat flows:", ["cold to hot", "hot to cold", "equal", "none"], 1],
    ["NOT transparent:", ["glass", "water", "wall", "air"], 2],
    ["Closed circuit:", ["no flow", "current flows", "light only", "heat only"], 1],
    ["NOT force unit:", ["Newton", "dyne", "Joule", "kg m/s^2"], 2],
    ["Work depends on:", ["force + distance", "time", "speed", "mass"], 0],
    ["Power tells:", ["total work", "rate of work", "distance", "time"], 1],
    ["Example of rest:", ["moving car", "sitting person", "running boy", "flying bird"], 1],
    ["SI unit of power?", ["Watt", "Joule", "Newton", "kg"], 0],
    ["SI unit of work?", ["Joule", "Watt", "Newton", "kg"], 0],
    ["SI unit of force?", ["Newton", "Joule", "Watt", "kg"], 0],
    ["SI unit of speed?", ["m/s", "m^2", "kg", "N"], 0],
    ["Work requires?", ["force + movement", "time", "speed", "rest"], 0],
    ["Energy stored in?", ["battery", "wood", "sand", "air"], 0],
    ["Not energy form?", ["heat", "light", "mass", "motion"], 2],
    ["Speed increases when?", ["distance increases", "time increases", "both", "none"], 0],
    ["Scalar quantity?", ["speed", "force", "acceleration", "velocity"], 0],
    ["Vector quantity?", ["speed", "force", "time", "distance"], 1],
    ["Moving ball has", ["kinetic energy", "potential energy", "none", "rest"], 0],
    ["PE depends on", ["height", "speed", "time", "mass"], 0],
    ["Gravity strongest", ["Earth", "space", "moon", "air"], 0],
    ["Time unit", ["sec", "m", "kg", "N"], 0],
    ["Length unit", ["meter", "sec", "kg", "J"], 0],
    ["Heat measured in", ["Joule", "Watt", "N", "kg"], 0],
    ["Light helps", ["vision", "sleep", "rest", "none"], 0],
    ["Reflection", ["mirror", "wall", "wood", "air"], 0],
    ["Circuit needs", ["battery", "wood", "sand", "air"], 0],
    ["Current flows in", ["closed", "open", "broken", "none"], 0],
    ["Insulator", ["rubber", "copper", "iron", "silver"], 0],
    ["Conductor", ["copper", "rubber", "plastic", "wood"], 0],
    ["Friction", ["opposes motion", "increases speed", "none", "rest"], 0],
    ["More force", ["more work", "less work", "none", "zero"], 0],
    ["Less time", ["more power", "less power", "none", "zero"], 0],
    ["Speed formula", ["d/t", "d*t", "t/d", "none"], 0],
    ["Time formula", ["d/s", "s/d", "d*s", "none"], 0],
    ["Distance formula", ["s*t", "s/t", "t/s", "none"], 0],
    ["Faster", ["less time", "more time", "none", "rest"], 0],
    ["Slower", ["more time", "less time", "none", "rest"], 0],
    ["Zero work", ["no displacement", "motion", "speed", "none"], 0],
    ["Energy", ["conserved", "destroyed", "none", "lost"], 0],
    ["Force changes", ["motion", "rest", "sleep", "none"], 0],
    ["Sun gives", ["heat+light", "only light", "none", "air"], 0],
    ["Opaque", ["wood", "glass", "air", "water"], 0],
    ["Transparent", ["glass", "wall", "wood", "iron"], 0],
    ["Motion", ["walking", "sitting", "rest", "none"], 0],
    ["Rest", ["sitting", "running", "jumping", "none"], 0],
    ["Energy unit", ["Joule", "Watt", "N", "kg"], 0],
    ["Power unit", ["Watt", "Joule", "N", "kg"], 0],
    ["Work lifting", ["positive", "negative", "zero", "none"], 0],
    ["Push wall", ["zero", "high", "low", "none"], 0],
    ["Energy needed", ["work", "rest", "stop", "none"], 0],
    ["Uses electricity", ["fan", "stone", "wood", "sand"], 0],
    ["Produces light", ["bulb", "book", "table", "wall"], 0],
    ["Stores energy", ["battery", "paper", "sand", "wood"], 0],
    ["Fastest", ["jet", "cycle", "car", "bus"], 0],
    ["Slowest", ["walking", "car", "plane", "train"], 0],
    ["Non-uniform", ["accelerating car", "steady fan", "none", "rest"], 0],
    ["Uniform", ["constant speed", "changing", "none", "rest"], 0],
    ["Speed tells", ["fast", "slow", "none", "rest"], 0],
    ["Distance tells", ["far", "near", "none", "rest"], 0],
    ["Time tells", ["duration", "speed", "none", "rest"], 0],
    ["Force needed", ["motion change", "rest", "none", "sleep"], 0],
    ["Gravity acts", ["all objects", "none", "air only", "none"], 0],
    ["Heat increases", ["temp", "speed", "none", "rest"], 0],
    ["Light fastest in", ["vacuum", "air", "water", "glass"], 0],
    ["Energy used", ["motion", "rest", "none", "sleep"], 0],
    ["Work produces", ["energy transfer", "rest", "none", "sleep"], 0],
    ["Science helps", ["understand nature", "sleep", "rest", "none"], 0]
];

const CLASS8_QUIZ_POOL = [
    ["Force is defined as:", ["mass x velocity", "mass x acceleration", "acceleration x time", "velocity / time"], 1],
    ["Pressure is given by:", ["F x A", "A / F", "F / A", "F + A"], 2],
    ["SI unit of force is:", ["Joule", "Pascal", "Watt", "Newton"], 3],
    ["SI unit of pressure is:", ["Newton", "Pascal", "Joule", "Watt"], 1],
    ["Work is calculated as:", ["force x distance", "distance / time", "mass x acceleration", "force / area"], 0],
    ["Power is:", ["work x time", "work / time", "force x distance", "energy x time"], 1],
    ["Density is:", ["volume / mass", "mass x volume", "mass / volume", "volume x time"], 2],
    ["Which is NOT a unit of density?", ["kg/m^3", "g/cm^3", "m^3/kg", "kg/m^2"], 3],
    ["Pressure increases when:", ["area increases", "force decreases", "area decreases", "mass decreases"], 2],
    ["Friction always acts:", ["in direction of motion", "opposite to motion", "upward", "downward"], 1],
    ["Which is a vector quantity?", ["mass", "time", "force", "distance"], 2],
    ["Which is a scalar quantity?", ["force", "velocity", "acceleration", "mass"], 3],
    ["Kinetic energy depends on:", ["height", "speed", "time", "temperature"], 1],
    ["Potential energy depends on:", ["speed", "mass only", "height", "force"], 2],
    ["Work done is zero when:", ["force is applied", "object moves", "no displacement", "energy present"], 2],
    ["Power tells us:", ["total work", "speed of work done", "force applied", "distance moved"], 1],
    ["Friction can be reduced by:", ["rough surface", "lubrication", "increasing force", "increasing area"], 1],
    ["Friction increases when:", ["surfaces are smooth", "lubrication used", "surfaces are rough", "speed is zero"], 2],
    ["Which of these is a conductor?", ["rubber", "plastic", "copper", "wood"], 2],
    ["Which of these is an insulator?", ["iron", "copper", "rubber", "aluminum"], 2],
    ["Work depends on:", ["force and distance", "speed and time", "mass and area", "force and time"], 0],
    ["Pressure is maximum when:", ["area is large", "force is small", "area is small", "time increases"], 2],
    ["Which shows balanced forces?", ["object accelerating", "object moving with changing speed", "object at rest", "object falling"], 2],
    ["Unbalanced force results in:", ["no change", "motion", "rest", "zero force"], 1],
    ["Energy is defined as:", ["force", "power", "ability to do work", "speed"], 2],
    ["SI unit of energy:", ["Watt", "Joule", "Newton", "Pascal"], 1],
    ["Which is NOT energy?", ["heat", "light", "mass", "motion"], 2],
    ["Work done lifting an object is:", ["zero", "negative", "positive", "none"], 2],
    ["Work done pushing a wall is:", ["zero", "positive", "negative", "infinite"], 0],
    ["Which has more pressure?", ["large area", "small area", "no force", "same area"], 1],
    ["Density increases when:", ["mass increases", "volume increases", "both decrease", "none"], 0],
    ["Object floats when:", ["density high", "density low", "force zero", "pressure high"], 1],
    ["Object sinks when:", ["density low", "density high", "no mass", "no volume"], 1],
    ["Pressure in liquids acts:", ["downward only", "upward only", "in all directions", "sideways only"], 2],
    ["Gases exert:", ["no pressure", "pressure", "only force", "no energy"], 1],
    ["Lubricants are used to:", ["increase friction", "reduce friction", "stop motion", "increase force"], 1],
    ["Which is example of kinetic energy?", ["stretched spring", "raised stone", "moving ball", "water tank"], 2],
    ["Which is example of potential energy?", ["moving car", "flying bird", "lifted object", "rolling ball"], 2],
    ["Power increases when:", ["time increases", "time decreases", "force decreases", "distance decreases"], 1],
    ["Which statement is correct?", ["work = force/time", "power = force x distance", "pressure = force/area", "density = volume/mass"], 2],
    ["Which formula is correct for density?", ["volume / mass", "mass / volume", "mass x volume", "volume x time"], 1],
    ["What happens when force increases (area constant)?", ["pressure decreases", "pressure increases", "pressure same", "pressure zero"], 1],
    ["Which is an example of friction?", ["ball rolling", "brakes stopping car", "light reflection", "sound production"], 1],
    ["Balanced forces result in:", ["acceleration", "motion change", "no change in motion", "high speed"], 2],
    ["Unbalanced forces cause:", ["rest", "no movement", "change in motion", "no force"], 2],
    ["Which is NOT a unit of force?", ["Newton", "dyne", "Joule", "kg.m/s^2"], 2],
    ["Pressure is measured using:", ["thermometer", "barometer", "clock", "scale"], 1],
    ["Which has kinetic energy?", ["resting book", "moving bicycle", "standing person", "fixed wall"], 1],
    ["Which has potential energy?", ["rolling ball", "flying bird", "raised weight", "running person"], 2],
    ["Friction is useful in:", ["walking", "slipping", "flying", "floating"], 0],
    ["Which increases friction?", ["smooth surface", "rough surface", "oil", "grease"], 1],
    ["Which reduces friction?", ["rough surface", "sand", "lubrication", "uneven surface"], 2],
    ["Which is true for pressure?", ["inversely proportional to area", "directly proportional to area", "independent of area", "zero always"], 0],
    ["A sharp knife cuts easily because:", ["low force", "high pressure", "low pressure", "no force"], 1],
    ["A camel walks easily on sand because:", ["high pressure", "low pressure", "no pressure", "high force"], 1],
    ["Work is done when:", ["force applied with displacement", "no movement", "no force", "only time changes"], 0],
    ["Power is zero when:", ["no work done", "time is small", "distance increases", "force increases"], 0],
    ["Density is highest when:", ["mass small", "volume large", "mass large, volume small", "mass zero"], 2],
    ["Which floats in water?", ["iron", "stone", "wood", "steel"], 2],
    ["Which sinks in water?", ["cork", "wood", "iron", "plastic"], 2],
    ["Pressure in liquids depends on:", ["depth", "width", "color", "speed"], 0],
    ["Pressure acts in:", ["one direction", "two directions", "all directions", "upward only"], 2],
    ["Gases exert pressure on:", ["top only", "bottom only", "all sides", "none"], 2],
    ["Which is NOT a form of energy?", ["heat", "light", "mass", "sound"], 2],
    ["Which energy is stored in stretched spring?", ["kinetic", "potential", "heat", "sound"], 1],
    ["Work done is positive when:", ["force opposite direction", "force same direction", "no movement", "no force"], 1],
    ["Work done is negative when:", ["force opposite motion", "force same direction", "no force", "no movement"], 0],
    ["Work done is zero when:", ["no displacement", "high force", "high speed", "large mass"], 0],
    ["Which increases power?", ["more time", "less work", "less time", "no force"], 2],
    ["Unit of work is:", ["Joule", "Watt", "Newton", "Pascal"], 0],
    ["Unit of power is:", ["Joule", "Watt", "Newton", "Pascal"], 1],
    ["Unit of pressure is:", ["Newton", "Joule", "Pascal", "Watt"], 2],
    ["Unit of density is:", ["kg/m^3", "m^3/kg", "kg", "m"], 0],
    ["Which affects pressure?", ["force & area", "time", "mass", "speed"], 0],
    ["Which reduces pressure?", ["small area", "large area", "more force", "less time"], 1],
    ["Friction depends on:", ["surface type", "color", "shape only", "temperature only"], 0],
    ["Which is NOT friction type?", ["sliding", "rolling", "static", "magnetic"], 3],
    ["Which is example of sliding friction?", ["box sliding", "wheel rolling", "object at rest", "bird flying"], 0],
    ["Which is example of rolling friction?", ["sliding box", "rolling ball", "flying bird", "standing person"], 1],
    ["Which has least friction?", ["rolling", "sliding", "static", "none"], 0],
    ["Which has maximum friction?", ["rolling", "sliding", "static", "none"], 2],
    ["Which is true?", ["energy destroyed", "energy created", "energy conserved", "energy lost"], 2],
    ["Energy changes from:", ["one form to another", "lost completely", "destroyed", "none"], 0],
    ["Which uses energy?", ["moving car", "sleeping person", "empty box", "still object"], 0],
    ["Which stores energy?", ["battery", "stone", "air", "sand"], 0],
    ["Work depends on:", ["force & distance", "time", "speed", "mass only"], 0],
    ["Power depends on:", ["work & time", "distance", "mass", "speed"], 0],
    ["Which is true?", ["pressure = F x A", "pressure = F / A", "pressure = A / F", "pressure = F + A"], 1],
    ["Which is correct?", ["density = m/v", "density = v/m", "density = m x v", "density = m+t"], 0],
    ["Which is correct?", ["work = F x d", "work = d/t", "work = t/d", "work = m x a"], 0],
    ["Which is correct?", ["power = W/t", "power = t/W", "power = F x d", "power = m x a"], 0],
    ["Which is scalar?", ["force", "velocity", "mass", "acceleration"], 2],
    ["Which is vector?", ["time", "mass", "force", "distance"], 2],
    ["Which object moves fastest?", ["cycle", "car", "airplane", "bus"], 2],
    ["Which object moves slowest?", ["walking person", "car", "train", "plane"], 0],
    ["Which increases density?", ["more mass", "more volume", "less mass", "zero mass"], 0],
    ["Which decreases density?", ["more volume", "more mass", "less volume", "zero area"], 0],
    ["Which is example of pressure?", ["high heel shoe", "sleeping", "reading", "writing"], 0],
    ["Science helps us:", ["understand nature", "sleep", "rest", "stop"], 0],
    ["Physics studies:", ["motion & force", "food", "plants", "sleep"], 0]
];

const CLASS9_QUIZ_POOL = [
    ["(x + 2)^2 = ?", ["x^2 + 4", "x^2 + 2x + 4", "x^2 + 4x + 4", "x^2 - 4x + 4"], 2],
    ["SI unit of force:", ["Joule", "Watt", "Newton", "Pascal"], 2],
    ["H2O is:", ["element", "compound", "mixture", "metal"], 1],
    ["Speed =", ["distance/time", "time/distance", "distance*time", "force/time"], 0],
    ["sqrt(81) = ?", ["8", "9", "7", "6"], 1],
    ["SI unit of energy:", ["Watt", "Newton", "Joule", "Pascal"], 2],
    ["NaCl is:", ["acid", "base", "salt", "gas"], 2],
    ["2x + 3x = ?", ["5x", "6x", "x^2", "2x^2"], 0],
    ["Acceleration unit:", ["m/s", "m/s^2", "m^2/s", "kg"], 1],
    ["Oxygen is:", ["metal", "liquid", "gas", "solid"], 2],
    ["(a - b)^2 = ?", ["a^2 - b^2", "a^2 - 2ab + b^2", "a^2 + 2ab + b^2", "a^2 + b^2"], 1],
    ["Force =", ["m*a", "m/a", "a/m", "m+a"], 0],
    ["Which is acid?", ["NaOH", "HCl", "NaCl", "CO2"], 1],
    ["15 / 3 = ?", ["4", "5", "6", "3"], 1],
    ["SI unit of power:", ["Joule", "Watt", "Newton", "Pascal"], 1],
    ["Which is base?", ["HCl", "NaOH", "CO2", "H2O"], 1],
    ["7^2 = ?", ["42", "49", "36", "56"], 1],
    ["Work =", ["F*d", "d/t", "m*a", "t/d"], 0],
    ["Ice is:", ["gas", "liquid", "solid", "plasma"], 2],
    ["20 - 8 = ?", ["10", "12", "14", "16"], 1],
    ["9^2 = ?", ["72", "81", "90", "99"], 1],
    ["Pressure unit:", ["Newton", "Joule", "Pascal", "Watt"], 2],
    ["CO2 is:", ["element", "compound", "metal", "base"], 1],
    ["Density =", ["m/v", "v/m", "m*v", "m+t"], 0],
    ["36 / 6 = ?", ["5", "6", "7", "8"], 1],
    ["Which is metal?", ["Oxygen", "Iron", "Nitrogen", "Sulfur"], 1],
    ["Momentum =", ["m*v", "v/m", "m/v", "m+t"], 0],
    ["8*7 = ?", ["54", "56", "58", "60"], 1],
    ["Which is element?", ["H2O", "CO2", "O2", "NaCl"], 2],
    ["Power =", ["W/t", "t/W", "F*d", "m*a"], 0],
    ["sqrt(49) = ?", ["6", "7", "8", "9"], 1],
    ["Which is mixture?", ["air", "oxygen", "water", "iron"], 0],
    ["Velocity unit:", ["m/s", "m/s^2", "kg", "N"], 0],
    ["4^3 = ?", ["12", "16", "64", "32"], 2],
    ["Which is non-metal?", ["Copper", "Iron", "Sulfur", "Aluminum"], 2],
    ["Work unit:", ["Joule", "Watt", "Newton", "Pascal"], 0],
    ["100 / 20 = ?", ["4", "5", "6", "7"], 1],
    ["Which is gas?", ["Ice", "Water", "Oxygen", "Iron"], 2],
    ["Acceleration =", ["(v-u)/t", "d/t", "m*a", "v*t"], 0],
    ["(x - 3)^2 = ?", ["x^2 - 6x + 9", "x^2 - 9", "x^2 + 6x + 9", "x^2 + 9"], 0],
    ["5^3 = ?", ["25", "125", "75", "100"], 1],
    ["SI unit of mass:", ["gram", "kg", "ton", "mg"], 1],
    ["HCl is:", ["base", "acid", "salt", "gas"], 1],
    ["18 / 2 = ?", ["6", "7", "9", "8"], 2],
    ["Heat is:", ["force", "energy", "mass", "speed"], 1],
    ["6*9 = ?", ["54", "56", "58", "60"], 0],
    ["CO2 is:", ["element", "compound", "metal", "base"], 1],
    ["Unit of force:", ["Joule", "Watt", "Newton", "Pascal"], 2],
    ["45 / 5 = ?", ["8", "9", "7", "6"], 1],
    ["O2 is:", ["compound", "mixture", "element", "base"], 2],
    ["8^2 = ?", ["64", "16", "32", "48"], 0],
    ["Density unit:", ["kg/m^3", "m^3/kg", "kg", "m"], 0],
    ["H2 is:", ["solid", "gas", "liquid", "metal"], 1],
    ["27 / 3 = ?", ["8", "9", "7", "6"], 1],
    ["Energy unit:", ["Joule", "Watt", "Newton", "Pascal"], 0],
    ["12*5 = ?", ["50", "55", "60", "65"], 2],
    ["NaOH is:", ["acid", "base", "salt", "gas"], 1],
    ["Velocity =", ["distance/time", "displacement/time", "speed/time", "none"], 1],
    ["20 / 4 = ?", ["4", "5", "6", "7"], 1],
    ["Iron is:", ["metal", "gas", "liquid", "non-metal"], 0],
    ["11^2 = ?", ["121", "111", "101", "112"], 0],
    ["Pascal is unit of:", ["force", "pressure", "energy", "power"], 1],
    ["H2SO4 is:", ["acid", "base", "salt", "gas"], 0],
    ["21 / 3 = ?", ["6", "7", "8", "9"], 1],
    ["Work =", ["F*d", "d/t", "t/d", "m*a"], 0],
    ["9*7 = ?", ["63", "72", "56", "54"], 0],
    ["Air is:", ["element", "compound", "mixture", "solid"], 2],
    ["Unit of time:", ["sec", "m", "kg", "N"], 0],
    ["40 / 5 = ?", ["6", "7", "8", "9"], 2],
    ["Copper is:", ["metal", "gas", "liquid", "non-metal"], 0],
    ["7^3 = ?", ["343", "49", "21", "63"], 0],
    ["Energy used in:", ["motion", "rest", "sleep", "none"], 0],
    ["CO2 is:", ["gas", "liquid", "solid", "metal"], 0],
    ["32 / 8 = ?", ["2", "3", "4", "5"], 2],
    ["Watt is unit of:", ["energy", "power", "force", "pressure"], 1],
    ["13*3 = ?", ["36", "39", "42", "45"], 1],
    ["Water is:", ["compound", "element", "mixture", "gas"], 0],
    ["Speed unit:", ["m/s", "m/s^2", "kg", "N"], 0],
    ["81 / 9 = ?", ["8", "9", "7", "6"], 1],
    ["Sulfur is:", ["metal", "non-metal", "gas", "liquid"], 1],
    ["14*2 = ?", ["26", "28", "30", "32"], 1],
    ["Nitrogen is:", ["gas", "solid", "metal", "liquid"], 0],
    ["Work done:", ["energy transfer", "rest", "sleep", "none"], 0],
    ["64 / 8 = ?", ["6", "7", "8", "9"], 2],
    ["Ice is:", ["solid", "liquid", "gas", "plasma"], 0],
    ["2*15 = ?", ["25", "30", "35", "20"], 1],
    ["Pressure =", ["F/A", "A/F", "F*A", "none"], 0],
    ["Oxygen is:", ["gas", "solid", "metal", "liquid"], 0],
    ["72 / 8 = ?", ["8", "9", "10", "7"], 1],
    ["Joule is unit of:", ["energy", "force", "power", "pressure"], 0],
    ["6*8 = ?", ["46", "48", "50", "52"], 1],
    ["Hydrogen is:", ["gas", "solid", "metal", "liquid"], 0],
    ["Power =", ["W/t", "t/W", "F*d", "m*a"], 0],
    ["48 / 6 = ?", ["6", "7", "8", "9"], 2],
    ["Science studies:", ["nature", "sleep", "rest", "none"], 0]
];

const CLASS10_QUIZ_POOL = [
    ["The value of sqrt(144) is:", ["10", "12", "14", "16"], 1],
    ["SI unit of electric current is:", ["Volt", "Ampere", "Ohm", "Watt"], 1],
    ["H2SO4 is:", ["Base", "Salt", "Acid", "Metal"], 2],
    ["Formula for speed is:", ["time/distance", "distance/time", "distance*time", "speed*time"], 1],
    ["15^2 = ?", ["225", "125", "215", "235"], 0],
    ["SI unit of resistance is:", ["Volt", "Ampere", "Ohm", "Joule"], 2],
    ["Which is a base?", ["HCl", "NaOH", "H2SO4", "CO2"], 1],
    ["4x + 3x = ?", ["6x", "7x", "8x", "x^2"], 1],
    ["Unit of power is:", ["Joule", "Watt", "Volt", "Ampere"], 1],
    ["Which is a metal?", ["Oxygen", "Nitrogen", "Iron", "Sulfur"], 2],
    ["(a+b)^2 = ?", ["a^2+b^2", "a^2+2ab+b^2", "a^2-2ab+b^2", "2a+2b"], 1],
    ["Voltage is measured in:", ["Volt", "Ampere", "Ohm", "Watt"], 0],
    ["Which is an acid?", ["NaOH", "HCl", "NaCl", "CaO"], 1],
    ["25 / 5 = ?", ["4", "5", "6", "7"], 1],
    ["Electric power =", ["VI", "V/I", "I/V", "V+I"], 0],
    ["Which is a non-metal?", ["Copper", "Iron", "Sulfur", "Aluminum"], 2],
    ["9^2 = ?", ["72", "81", "91", "99"], 1],
    ["Resistance =", ["V/I", "I/V", "VI", "V+I"], 0],
    ["Water is:", ["Element", "Compound", "Mixture", "Metal"], 1],
    ["30 - 12 = ?", ["16", "18", "20", "22"], 1],
    ["11^2 = ?", ["121", "111", "131", "101"], 0],
    ["SI unit of power:", ["Joule", "Watt", "Newton", "Pascal"], 1],
    ["NaCl is:", ["Acid", "Base", "Salt", "Gas"], 2],
    ["Density =", ["mass/volume", "volume/mass", "mass*volume", "mass+volume"], 0],
    ["64 / 8 = ?", ["6", "7", "8", "9"], 2],
    ["Which is a conductor?", ["Rubber", "Plastic", "Copper", "Wood"], 2],
    ["Current =", ["V*R", "V/R", "R/V", "V+R"], 1],
    ["6*7 = ?", ["36", "42", "48", "56"], 1],
    ["Which is a gas?", ["Ice", "Water", "Oxygen", "Iron"], 2],
    ["Work =", ["force*distance", "distance/time", "force/time", "mass*acceleration"], 0],
    ["sqrt(100) = ?", ["8", "9", "10", "11"], 2],
    ["Which is a mixture?", ["Air", "Oxygen", "Water", "Hydrogen"], 0],
    ["SI unit of force:", ["Joule", "Watt", "Newton", "Pascal"], 2],
    ["3^3 = ?", ["9", "18", "27", "36"], 2],
    ["Which is an insulator?", ["Copper", "Iron", "Plastic", "Aluminum"], 2],
    ["SI unit of energy:", ["Joule", "Watt", "Volt", "Ampere"], 0],
    ["45 / 9 = ?", ["4", "5", "6", "7"], 1],
    ["Which is liquid?", ["Oxygen", "Nitrogen", "Water", "Iron"], 2],
    ["Force =", ["m*a", "m/a", "a/m", "m+a"], 0],
    ["(x-2)^2 = ?", ["x^2-4x+4", "x^2+4", "x^2+4x+4", "x^2-2"], 0],
    ["12^2 = ?", ["124", "144", "154", "134"], 1],
    ["SI unit of charge:", ["Coulomb", "Volt", "Ampere", "Ohm"], 0],
    ["HCl is:", ["acid", "base", "salt", "gas"], 0],
    ["18 / 3 = ?", ["5", "6", "7", "8"], 1],
    ["Heat is a form of:", ["force", "energy", "mass", "speed"], 1],
    ["8*9 = ?", ["64", "72", "81", "90"], 1],
    ["CO2 is:", ["element", "compound", "metal", "base"], 1],
    ["Unit of resistance:", ["Volt", "Ohm", "Ampere", "Joule"], 1],
    ["81 / 9 = ?", ["8", "9", "10", "7"], 1],
    ["O2 is:", ["compound", "element", "mixture", "base"], 1],
    ["13^2 = ?", ["169", "149", "159", "179"], 0],
    ["Density unit:", ["kg/m^3", "m^3/kg", "kg", "m"], 0],
    ["H2 is:", ["solid", "gas", "liquid", "metal"], 1],
    ["24 / 4 = ?", ["5", "6", "7", "8"], 1],
    ["Energy unit:", ["Joule", "Watt", "Volt", "Ohm"], 0],
    ["14*5 = ?", ["60", "65", "70", "75"], 2],
    ["NaOH is:", ["acid", "base", "salt", "gas"], 1],
    ["Current is measured in:", ["Volt", "Ampere", "Ohm", "Watt"], 1],
    ["21 / 7 = ?", ["2", "3", "4", "5"], 1],
    ["Iron is:", ["metal", "gas", "liquid", "non-metal"], 0],
    ["10^2 = ?", ["10", "100", "20", "50"], 1],
    ["Pascal is unit of:", ["force", "pressure", "energy", "current"], 1],
    ["H2SO4 is:", ["acid", "base", "salt", "metal"], 0],
    ["27 / 3 = ?", ["8", "9", "10", "7"], 1],
    ["Work =", ["F*d", "d/t", "F/t", "m*a"], 0],
    ["7*8 = ?", ["54", "56", "58", "60"], 1],
    ["Air is:", ["element", "compound", "mixture", "solid"], 2],
    ["Unit of time:", ["sec", "m", "kg", "N"], 0],
    ["36 / 6 = ?", ["5", "6", "7", "8"], 1],
    ["Copper is:", ["metal", "gas", "liquid", "non-metal"], 0],
    ["4^3 = ?", ["16", "64", "32", "48"], 1],
    ["Electric energy =", ["VIt", "VI", "V/I", "I/V"], 0],
    ["Nitrogen is:", ["gas", "solid", "liquid", "metal"], 0],
    ["32 / 8 = ?", ["2", "3", "4", "5"], 2],
    ["Watt is unit of:", ["energy", "power", "current", "voltage"], 1],
    ["16*2 = ?", ["30", "32", "34", "36"], 1],
    ["Water is:", ["compound", "element", "mixture", "gas"], 0],
    ["Speed unit:", ["m/s", "m/s^2", "kg", "N"], 0],
    ["72 / 9 = ?", ["7", "8", "9", "6"], 1],
    ["Sulfur is:", ["metal", "non-metal", "gas", "liquid"], 1],
    ["5*12 = ?", ["50", "60", "70", "80"], 1],
    ["Motion means:", ["rest", "change in position", "no force", "no speed"], 1],
    ["Ozone is:", ["gas", "liquid", "solid", "metal"], 0],
    ["90 / 10 = ?", ["8", "9", "10", "7"], 1],
    ["Newton is unit of:", ["force", "energy", "power", "pressure"], 0],
    ["7*7 = ?", ["42", "49", "56", "63"], 1],
    ["Hydrogen is:", ["gas", "liquid", "solid", "metal"], 0],
    ["Power =", ["W/t", "t/W", "F*d", "V*I*R"], 0],
    ["48 / 6 = ?", ["6", "7", "8", "9"], 2],
    ["Ice is:", ["solid", "liquid", "gas", "plasma"], 0],
    ["3*15 = ?", ["35", "40", "45", "50"], 2],
    ["Pressure =", ["F/A", "A/F", "F*A", "none"], 0],
    ["Oxygen is:", ["gas", "liquid", "solid", "metal"], 0],
    ["56 / 7 = ?", ["6", "7", "8", "9"], 2],
    ["Joule is unit of:", ["energy", "force", "current", "pressure"], 0],
    ["9*6 = ?", ["52", "54", "56", "58"], 1],
    ["Sodium is:", ["metal", "non-metal", "gas", "liquid"], 0],
    ["Resistance =", ["V/I", "I/V", "VI", "none"], 0],
    ["42 / 6 = ?", ["5", "6", "7", "8"], 2],
    ["Science studies:", ["nature", "sleep", "rest", "none"], 0]
];

function shuffleArray(items) {
    const cloned = items.slice();
    for (let i = cloned.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cloned[i];
        cloned[i] = cloned[j];
        cloned[j] = temp;
    }
    return cloned;
}

function clearQuizTimer() {
    if (quizTimerId) {
        clearInterval(quizTimerId);
        quizTimerId = null;
    }
}

function startQuizTimer() {
    clearQuizTimer();
    const baseTime = currentQuiz && currentQuiz.timePerQuestion ? currentQuiz.timePerQuestion : 15;
    quizTimeLeft = baseTime;

    const timerElement = document.getElementById("quiz-timer");
    if (timerElement) {
        timerElement.textContent = `Time left: ${quizTimeLeft}s`;
        timerElement.classList.remove("urgent");
    }

    quizTimerId = setInterval(function () {
        quizTimeLeft -= 1;

        const timer = document.getElementById("quiz-timer");
        if (timer) {
            timer.textContent = `Time left: ${quizTimeLeft}s`;
            if (quizTimeLeft <= 5) {
                timer.classList.add("urgent");
            }
        }

        if (quizTimeLeft <= 0) {
            clearQuizTimer();
            submitQuizQuestion(true);
        }
    }, 1000);
}

function pickProgressiveTenQuestions(pool) {
    const selected = [];
    const blockSize = 10;

    for (let blockStart = 0; blockStart < pool.length; blockStart += blockSize) {
        const block = pool.slice(blockStart, blockStart + blockSize);
        if (!block.length) {
            continue;
        }
        const randomIndex = Math.floor(Math.random() * block.length);
        const chosen = block[randomIndex];
        selected.push({
            question: chosen[0],
            options: chosen[1],
            answer: chosen[2]
        });
    }

    return selected;
}

function pickRandomQuestions(pool, count) {
    const shuffled = shuffleArray(pool);
    const limited = shuffled.slice(0, Math.min(count, shuffled.length));
    return limited.map(function (entry) {
        return {
            question: entry[0],
            options: entry[1],
            answer: entry[2]
        };
    });
}

function registerServiceWorker() {
    // To avoid stale cached JS/CSS causing missing celebration UI, always clear old SW cache.
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            registrations.forEach(function (registration) {
                registration.unregister();
            });
        });
    }

    if ("caches" in window) {
        caches.keys().then(function (keys) {
            keys.forEach(function (key) {
                caches.delete(key);
            });
        });
    }
}

function highlightSubjectButton(subject) {
    const subjectButtons = document.querySelectorAll(".subject-btn");
    subjectButtons.forEach(function (button) {
        const isActive = button.textContent.trim().toLowerCase() === subject;
        button.style.background = isActive ? "#22d3ee" : "#111827";
        button.style.borderColor = isActive ? "#22d3ee" : "rgba(148, 163, 184, 0.35)";
        button.style.color = isActive ? "#0b1118" : "#e2e8f0";
    });
}

function getCurrentClassNumber() {
    return new URLSearchParams(window.location.search).get("class") || "";
}

function getSessionSubjectLabel(subject) {
    if (subject === "physics") {
        return "Physics";
    }
    if (subject === "maths") {
        return "Maths";
    }
    if (subject === "chemistry") {
        return "Chemistry";
    }
    if (subject === "quiz") {
        return "Quiz";
    }
    if (subject === "calculator") {
        return "Calculator";
    }
    return "Session";
}

function loadSessionHistory() {
    const raw = localStorage.getItem(SESSION_HISTORY_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(function (item) {
            return item &&
                typeof item.id === "string" &&
                typeof item.subject === "string" &&
                typeof item.classNumber === "string";
        });
    } catch (error) {
        return [];
    }
}

function saveSessionHistory(history) {
    localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
}

function formatSessionTime(timestamp) {
    const date = new Date(timestamp || Date.now());
    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function loadParentStats() {
    const raw = localStorage.getItem(PARENT_STATS_KEY);
    if (!raw) {
        return { lastActivity: null, quizzes: {} };
    }

    try {
        const parsed = JSON.parse(raw);
        const quizzes = parsed && typeof parsed === "object" && parsed.quizzes ? parsed.quizzes : {};
        return {
            lastActivity: parsed && parsed.lastActivity ? parsed.lastActivity : null,
            quizzes: quizzes
        };
    } catch (error) {
        return { lastActivity: null, quizzes: {} };
    }
}

function saveParentStats(stats) {
    localStorage.setItem(PARENT_STATS_KEY, JSON.stringify(stats));
}

function updateParentActivity(subject, classNumber) {
    const stats = loadParentStats();
    stats.lastActivity = {
        classNumber: String(classNumber || ""),
        subject: subject,
        viewMode: currentViewMode,
        savedAt: Date.now()
    };
    saveParentStats(stats);
}

function recordQuizResult(classNumber, score, total) {
    const stats = loadParentStats();
    if (!stats.quizzes || typeof stats.quizzes !== "object") {
        stats.quizzes = {};
    }
    stats.quizzes[String(classNumber || "")] = {
        score: score,
        total: total,
        savedAt: Date.now()
    };
    saveParentStats(stats);
}

function getVoiceTextFromContent(content) {
    if (!content) {
        return "";
    }
    const nodes = content.querySelectorAll("h2, h3, p");
    const parts = [];
    nodes.forEach(function (node) {
        const text = (node.textContent || "").trim();
        if (!text) {
            return;
        }
        if (text.toLowerCase().startsWith("please select")) {
            return;
        }
        parts.push(text);
    });
    return parts.join(". ");
}

function startFormulaVoice() {
    if (!("speechSynthesis" in window)) {
        alert("Voice is not supported on this device.");
        return;
    }

    const content = document.getElementById("content");
    const text = getVoiceTextFromContent(content);
    if (!text) {
        alert("No formulas to read yet.");
        return;
    }

    stopFormulaVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-IN";
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
}

function stopFormulaVoice() {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
}

function renderSessionHistory() {
    const list = document.querySelector(".session-list");
    if (!list) {
        return;
    }

    const history = loadSessionHistory();
    const classNumber = getCurrentClassNumber();

    if (!history.length) {
        list.innerHTML = "";
        return;
    }

    const items = history.map(function (entry) {
        const isCurrentClass = entry.classNumber === classNumber;
        const title = `Class ${entry.classNumber} - ${getSessionSubjectLabel(entry.subject)}`;
        const subtitle = formatSessionTime(entry.savedAt);
        const classTag = isCurrentClass ? " (current)" : "";
        return `
            <li>
                <a href="#" data-session-id="${entry.id}">${title}${classTag}<br><small>${subtitle}</small></a>
            </li>
        `;
    }).join("");

    list.innerHTML = items;
}

function saveCurrentSession(subject, classNumber) {
    if (isRestoringSession) {
        return;
    }

    const currentClass = String(classNumber || getCurrentClassNumber() || "");
    if (!currentClass || !subject) {
        return;
    }

    const history = loadSessionHistory();
    const deduped = history.filter(function (entry) {
        return !(entry.classNumber === currentClass && entry.subject === subject);
    });

    const nextEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        classNumber: currentClass,
        subject: subject,
        viewMode: currentViewMode,
        savedAt: Date.now()
    };

    updateParentActivity(subject, currentClass);

    deduped.unshift(nextEntry);
    saveSessionHistory(deduped.slice(0, MAX_SESSION_HISTORY));
    renderSessionHistory();
}

function applySessionEntry(entry) {
    if (!entry || !entry.subject || !entry.classNumber) {
        return;
    }

    const currentClass = getCurrentClassNumber();
    if (entry.classNumber !== currentClass) {
        const target = `notes.html?class=${encodeURIComponent(entry.classNumber)}&restoreSession=${encodeURIComponent(entry.id)}`;
        window.location.href = target;
        return;
    }

    if (entry.viewMode === "normal" || entry.viewMode === "attractive") {
        currentViewMode = entry.viewMode;
        localStorage.setItem("formulanestViewMode", currentViewMode);
        syncViewModeButtons();
    }

    isRestoringSession = true;
    try {
        if (entry.subject === "quiz") {
            startQuiz();
        } else if (entry.subject === "calculator") {
            showCalculator();
        } else {
            showNotes(entry.subject);
        }
    } finally {
        isRestoringSession = false;
    }
}

function handleSessionListClick(event) {
    const target = event.target.closest("a[data-session-id]");
    if (!target) {
        return;
    }

    event.preventDefault();
    const sessionId = target.getAttribute("data-session-id");
    const history = loadSessionHistory();
    const selected = history.find(function (entry) {
        return entry.id === sessionId;
    });

    applySessionEntry(selected);
}

function initSessionPanel() {
    const list = document.querySelector(".session-list");
    if (!list) {
        return;
    }

    list.addEventListener("click", handleSessionListClick);
    renderSessionHistory();
}

function restoreSessionFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const restoreSessionId = params.get("restoreSession");
    if (!restoreSessionId) {
        return;
    }

    const history = loadSessionHistory();
    const selected = history.find(function (entry) {
        return entry.id === restoreSessionId;
    });

    applySessionEntry(selected);

    params.delete("restoreSession");
    const updatedQuery = params.toString();
    const updatedUrl = `${window.location.pathname}${updatedQuery ? `?${updatedQuery}` : ""}`;
    window.history.replaceState({}, "", updatedUrl);
}

function autoStartQuizFromQuery() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("quiz") !== "1") {
        return;
    }

    const classNumber = params.get("class");
    if (!classNumber) {
        return;
    }

    setTimeout(function () {
        startQuiz();
    }, 50);
}

function autoOpenSubjectFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const subject = (params.get("subject") || "").toLowerCase();
    if (!subject) {
        return;
    }

    if (subject !== "physics" && subject !== "maths" && subject !== "chemistry") {
        return;
    }

    setTimeout(function () {
        showNotes(subject);
    }, 20);
}

function syncViewModeButtons() {
    const normalButton = document.getElementById("mode-normal");
    const attractiveButton = document.getElementById("mode-attractive");

    if (!normalButton || !attractiveButton) {
        return;
    }

    normalButton.classList.toggle("active", currentViewMode === "normal");
    attractiveButton.classList.toggle("active", currentViewMode === "attractive");
}

function setViewMode(mode) {
    currentViewMode = mode === "normal" ? "normal" : "attractive";
    localStorage.setItem("formulanestViewMode", currentViewMode);
    syncViewModeButtons();

    if (currentSubject === "quiz") {
        const content = document.getElementById("content");
        if (content) {
            applyNotesTheme("quiz", content);
        }
        renderQuizQuestion();
    } else if (currentSubject) {
        showNotes(currentSubject);
    }
}

function ensureQuizButtonVisible() {
    const quizButton = document.getElementById("quiz-btn");
    if (!quizButton) {
        return;
    }
    quizButton.style.display = "inline-block";
}

function updateQuizButtonLabel(classNumber) {
    const quizButton = document.getElementById("quiz-btn");
    if (!quizButton) {
        return;
    }

    quizButton.textContent = "Quiz";
}

function isCalculatorAvailableForClass(classNumber) {
    return classNumber === "6" || classNumber === "7" || classNumber === "8" || classNumber === "9" || classNumber === "10";
}

function renderCalculatorContent(content, classNumber) {
    const classTips = {
        "6": "Use this for basic arithmetic and quick practice.",
        "7": "Use this for quick arithmetic and mixed operations.",
        "8": "Use this for percentages, algebra basics, and mensuration values.",
        "9": "Use this for motion, force, and square-root calculations.",
        "10": "Use this for trigonometry values, AP terms, and quadratic practice."
    };
    const tip = classTips[classNumber] || "Use this calculator for quick practice.";

    content.innerHTML = `
        <h2>Class ${classNumber} Calculator</h2>
        <div class="calculator-card">
            <input id="calculator-display" class="calculator-display" type="text" value="${calculatorExpression || "0"}" readonly>
            <div class="calculator-grid">
                <button class="calc-btn clear" onclick="clearCalculator()">C</button>
                <button class="calc-btn clear" onclick="deleteCalculatorChar()">DEL</button>
                <button class="calc-btn operator" onclick="appendCalculatorValue('(')">(</button>
                <button class="calc-btn operator" onclick="appendCalculatorValue(')')">)</button>

                <button class="calc-btn" onclick="appendCalculatorValue('7')">7</button>
                <button class="calc-btn" onclick="appendCalculatorValue('8')">8</button>
                <button class="calc-btn" onclick="appendCalculatorValue('9')">9</button>
                <button class="calc-btn operator" onclick="appendCalculatorValue('/')">/</button>

                <button class="calc-btn" onclick="appendCalculatorValue('4')">4</button>
                <button class="calc-btn" onclick="appendCalculatorValue('5')">5</button>
                <button class="calc-btn" onclick="appendCalculatorValue('6')">6</button>
                <button class="calc-btn operator" onclick="appendCalculatorValue('*')">*</button>

                <button class="calc-btn" onclick="appendCalculatorValue('1')">1</button>
                <button class="calc-btn" onclick="appendCalculatorValue('2')">2</button>
                <button class="calc-btn" onclick="appendCalculatorValue('3')">3</button>
                <button class="calc-btn operator" onclick="appendCalculatorValue('-')">-</button>

                <button class="calc-btn" onclick="appendCalculatorValue('0')">0</button>
                <button class="calc-btn" onclick="appendCalculatorValue('.')">.</button>
                <button class="calc-btn equal" onclick="evaluateCalculator()">=</button>
                <button class="calc-btn operator" onclick="appendCalculatorValue('+')">+</button>
            </div>
            <div class="calculator-help">${tip}</div>
        </div>
    `;
}

function showCalculator() {
    const content = document.getElementById("content");
    const classNumber = getCurrentClassNumber();

    if (!content) {
        return;
    }

    clearQuizTimer();
    currentSubject = "calculator";
    highlightSubjectButton("calculator");
    applyNotesTheme("calculator", content);
    setNotesQuote(null, classNumber);

    if (!isCalculatorAvailableForClass(classNumber)) {
        content.innerHTML = `
            <h2>Calculator</h2>
            <p>Calculator is available for Class 6, Class 7, Class 8, Class 9, and Class 10.</p>
        `;
        decorateNotesContent(content);
        saveCurrentSession("calculator", classNumber);
        return;
    }

    renderCalculatorContent(content, classNumber);
    saveCurrentSession("calculator", classNumber);
}

function updateCalculatorDisplay() {
    const display = document.getElementById("calculator-display");
    if (!display) {
        return;
    }
    display.value = calculatorExpression || "0";
}

function appendCalculatorValue(value) {
    if (calculatorExpression === "Error") {
        calculatorExpression = "";
    }
    calculatorExpression += value;
    updateCalculatorDisplay();
}

function clearCalculator() {
    calculatorExpression = "";
    updateCalculatorDisplay();
}

function deleteCalculatorChar() {
    if (!calculatorExpression.length) {
        return;
    }
    calculatorExpression = calculatorExpression.slice(0, -1);
    updateCalculatorDisplay();
}

function evaluateCalculator() {
    if (!calculatorExpression.trim()) {
        return;
    }

    if (calculatorExpression === "Error") {
        return;
    }

    const sanitized = calculatorExpression.replace(/\s+/g, "");
    const allowed = /^[0-9+\-*/().]+$/;

    if (!allowed.test(sanitized)) {
        calculatorExpression = "Error";
        updateCalculatorDisplay();
        return;
    }

    try {
        const result = Function(`"use strict"; return (${sanitized});`)();
        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }
        calculatorExpression = String(Number(result.toFixed(10)));
    } catch (error) {
        calculatorExpression = "Error";
    }

    updateCalculatorDisplay();
}

function handleCalculatorKeyboard(event) {
    if (currentSubject !== "calculator") {
        return;
    }

    const classNumber = new URLSearchParams(window.location.search).get("class");
    if (!isCalculatorAvailableForClass(classNumber)) {
        return;
    }

    const target = event.target;
    if (target && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
    )) {
        return;
    }

    const key = event.key;
    const allowedKeys = "0123456789+-*/().";

    if (allowedKeys.includes(key)) {
        event.preventDefault();
        appendCalculatorValue(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        evaluateCalculator();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        deleteCalculatorChar();
        return;
    }

    if (key === "Escape" || key === "Delete") {
        event.preventDefault();
        clearCalculator();
    }
}

function getQuizPoolForClass(classNumber) {
    if (classNumber === "6") {
        return CLASS6_QUIZ_POOL;
    }
    if (classNumber === "7") {
        return CLASS7_QUIZ_POOL;
    }
    if (classNumber === "8") {
        return CLASS8_QUIZ_POOL;
    }
    if (classNumber === "9") {
        return CLASS9_QUIZ_POOL;
    }
    if (classNumber === "10") {
        return CLASS10_QUIZ_POOL;
    }
    return null;
}

function startQuiz() {
    const params = new URLSearchParams(window.location.search);
    const classNumber = params.get("class");
    const content = document.getElementById("content");

    if (!content) {
        return;
    }

    stopFormulaVoice();
    clearQuizTimer();
    clearCelebrationPopup();

    const classPool = getQuizPoolForClass(classNumber);
    if (!classPool) {
        content.innerHTML = `
            <h2>Quiz</h2>
            <p>Quiz is currently available for Class 6, Class 7, Class 8, Class 9, and Class 10.</p>
        `;
        decorateNotesContent(content);
        saveCurrentSession("quiz", classNumber);
        return;
    }

    currentSubject = "quiz";
    highlightSubjectButton("quiz");
    applyNotesTheme("quiz", content);

    const poolSource = params.get("mode") === "weak" ? buildWeakTopicQuizPool(classNumber, classPool) : classPool;
    const isDaily = params.get("daily") === "1";
    const isExam = params.get("exam") === "1";
    const selectedQuestions = isDaily
        ? pickRandomQuestions(poolSource, 5)
        : isExam
            ? pickRandomQuestions(poolSource, 20)
            : pickProgressiveTenQuestions(poolSource);

    currentQuiz = {
        classNumber: classNumber,
        index: 0,
        score: 0,
        selected: null,
        questions: selectedQuestions,
        celebrationShown: false,
        responses: new Array(selectedQuestions.length).fill(null),
        isDaily: isDaily,
        isExam: isExam,
        timePerQuestion: isExam ? 25 : 15
    };

    renderQuizQuestion();
    saveCurrentSession("quiz", classNumber);
}

function clearCelebrationPopup() {
    const existing = document.getElementById("highscore-popup");
    if (existing) {
        existing.remove();
    }
}

function getHighScoreCelebration(score, total) {
    if (score === total) {
        return {
            eligible: true,
            isPerfect: true,
            popupText: "You scored 10/10. Outstanding performance!",
            bannerText: "Congratulations! Perfect Score 10/10!"
        };
    }

    if (score >= 9) {
        return {
            eligible: true,
            isPerfect: false,
            popupText: "You scored 9/10. Great effort and consistency!",
            bannerText: "Congratulations! Excellent Score 9/10!"
        };
    }

    return {
        eligible: false,
        isPerfect: false,
        popupText: "",
        bannerText: ""
    };
}

function saveHighScoreCelebration(classNumber, score, total, celebration) {
    if (!celebration || !celebration.eligible) {
        return;
    }

    const payload = {
        classNumber: String(classNumber || ""),
        score: score,
        total: total,
        isPerfect: celebration.isPerfect,
        popupText: celebration.popupText,
        bannerText: celebration.bannerText,
        savedAt: Date.now()
    };

    localStorage.setItem(LAST_CELEBRATION_KEY, JSON.stringify(payload));
}

function clearSavedCelebrationForClass(classNumber) {
    const raw = localStorage.getItem(LAST_CELEBRATION_KEY);
    if (!raw) {
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        if (!parsed || String(parsed.classNumber || "") === String(classNumber || "")) {
            localStorage.removeItem(LAST_CELEBRATION_KEY);
        }
    } catch (error) {
        localStorage.removeItem(LAST_CELEBRATION_KEY);
    }
}

function restoreCelebrationAfterReload() {
    if (hasRestoredCelebrationThisPage) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const classNumber = params.get("class") || "";
    if (!classNumber) {
        return;
    }

    const raw = localStorage.getItem(LAST_CELEBRATION_KEY);
    if (!raw) {
        return;
    }

    try {
        const saved = JSON.parse(raw);
        if (!saved || String(saved.classNumber || "") !== String(classNumber)) {
            return;
        }

        hasRestoredCelebrationThisPage = true;

        setTimeout(function () {
            showCelebrationPopup(saved.popupText || "Great score!", !!saved.isPerfect);
        }, 250);
    } catch (error) {
        localStorage.removeItem(LAST_CELEBRATION_KEY);
    }
}

function showCurrentQuizHighScorePopup() {
    if (!currentQuiz) {
        return;
    }

    const total = currentQuiz.questions.length;
    const celebration = getHighScoreCelebration(currentQuiz.score, total);
    if (!celebration.eligible) {
        return;
    }

    showCelebrationPopup(celebration.popupText, celebration.isPerfect);
}

function showCelebrationPopup(message, isPerfect) {
    clearCelebrationPopup();

    const popup = document.createElement("div");
    popup.id = "highscore-popup";
    popup.className = "highscore-popup";
    popup.innerHTML = `
        <div class="highscore-card ${isPerfect ? "perfect" : "great"}">
            <div class="highscore-title">${isPerfect ? "Perfect Score!" : "Excellent Work!"}</div>
            <div class="highscore-text">${message}</div>
            <button class="highscore-close" onclick="clearCelebrationPopup()">Close</button>
        </div>
    `;

    document.body.appendChild(popup);
}

function selectQuizOption(optionIndex) {
    if (!currentQuiz) {
        return;
    }
    currentQuiz.selected = optionIndex;
    currentQuiz.responses[currentQuiz.index] = optionIndex;

    // Small delay lets user see selected option before auto-next.
    setTimeout(function () {
        submitQuizQuestion(false, true);
    }, 250);
}

function goToPreviousQuizQuestion() {
    if (!currentQuiz || currentQuiz.index === 0) {
        return;
    }

    currentQuiz.index -= 1;
    currentQuiz.selected = currentQuiz.responses[currentQuiz.index];
    renderQuizQuestion();
}

function submitQuizQuestion(fromTimer, skipSelectionCheck) {
    if (!currentQuiz) {
        return;
    }

    const note = document.getElementById("quiz-note");
    if (!skipSelectionCheck && !fromTimer && currentQuiz.selected === null) {
        if (note) {
            note.textContent = "Please select one option first.";
        }
        return;
    }

    clearQuizTimer();

    currentQuiz.index += 1;
    currentQuiz.selected = currentQuiz.responses[currentQuiz.index] ?? null;

    if (currentQuiz.index >= currentQuiz.questions.length) {
        renderQuizCompletion();
        return;
    }

    renderQuizQuestion();
}

function renderQuizCompletion() {
    if (!currentQuiz) {
        return;
    }

    const content = document.getElementById("content");
    if (!content) {
        return;
    }

    clearQuizTimer();

    const total = currentQuiz.questions.length;
    let computedScore = 0;
    for (let i = 0; i < total; i += 1) {
        if (currentQuiz.responses[i] === currentQuiz.questions[i].answer) {
            computedScore += 1;
        }
    }

    currentQuiz.score = computedScore;
    recordQuizResult(currentQuiz.classNumber, computedScore, total);
    const celebration = getHighScoreCelebration(currentQuiz.score, total);
    const isPerfect = celebration.isPerfect;
    const hasHighScoreCelebration = celebration.eligible;
    const completionMessage = currentQuiz.score >= 8
        ? "Great job! You answered all questions."
        : "Try again. Keep practicing to improve your score.";
    const completionKudos = isPerfect
        ? "Kudos: Perfect 10/10 performance."
        : currentQuiz.score >= 9
            ? "Kudos: Excellent 9/10 score."
            : "Kudos: Tap Result to see full details.";

    if (hasHighScoreCelebration && !currentQuiz.celebrationShown) {
        showCelebrationPopup(celebration.popupText, isPerfect);
        saveHighScoreCelebration(currentQuiz.classNumber, currentQuiz.score, total, celebration);
        try {
            playPerfectScoreSound();
        } catch (error) {
            // Keep visual celebration even if browser blocks audio.
        }
        currentQuiz.celebrationShown = true;
    } else if (!hasHighScoreCelebration) {
        clearSavedCelebrationForClass(currentQuiz.classNumber);
    }

    const quizLabel = currentQuiz.isDaily ? "Daily 5" : currentQuiz.isExam ? "Exam Mode" : "Quiz";
    content.innerHTML = `
        <h2>Class ${currentQuiz.classNumber} ${quizLabel} Completed</h2>
        <div class="quiz-card">
            ${hasHighScoreCelebration ? `<div class="perfect-banner">${celebration.bannerText}</div>` : ""}
            <div class="quiz-question">${completionMessage}</div>
            <div class="quiz-question">Score: ${currentQuiz.score} / ${total}</div>
            <div class="quiz-kudos ${isPerfect ? "kudos-perfect" : currentQuiz.score >= 9 ? "kudos-excellent" : "kudos-default"}">${completionKudos}</div>
            <div class="quiz-actions">
                <button class="quiz-btn primary" onclick="renderQuizResult()">Result</button>
                <button class="quiz-btn secondary" onclick="renderQuizReview()">Review Questions</button>
                <button class="quiz-btn secondary" onclick="startQuiz()">Restart</button>
            </div>
        </div>
    `;
}

function renderQuizReview() {
    if (!currentQuiz) {
        return;
    }

    const content = document.getElementById("content");
    if (!content) {
        return;
    }

    const total = currentQuiz.questions.length;
    let computedScore = 0;
    for (let i = 0; i < total; i += 1) {
        if (currentQuiz.responses[i] === currentQuiz.questions[i].answer) {
            computedScore += 1;
        }
    }

    currentQuiz.score = computedScore;
    recordQuizInsights(computedScore, total);
    const celebration = getHighScoreCelebration(computedScore, total);
    const hasHighScoreCelebration = celebration.eligible;

    if (hasHighScoreCelebration) {
        showCelebrationPopup(celebration.popupText, celebration.isPerfect);
        saveHighScoreCelebration(currentQuiz.classNumber, computedScore, total, celebration);
        currentQuiz.celebrationShown = true;
    } else {
        clearSavedCelebrationForClass(currentQuiz.classNumber);
    }

    const reviewKudos = computedScore === total
        ? "Kudos: Perfect 10/10 performance."
        : computedScore >= 9
            ? "Kudos: Excellent 9/10 score."
            : "Kudos: Keep practicing for a higher score.";
    const reviewKudosClass = computedScore === total
        ? "kudos-perfect"
        : computedScore >= 9
            ? "kudos-excellent"
            : "kudos-default";

    const reviewItems = currentQuiz.questions.map(function (q, index) {
        const selectedIndex = currentQuiz.responses[index];
        const isUnanswered = selectedIndex === null || selectedIndex === undefined;
        const selectedText = isUnanswered ? "Did not attend" : q.options[selectedIndex];
        const correctText = q.options[q.answer];
        const statusText = isUnanswered ? "Did not attend" : (selectedIndex === q.answer ? "Correct" : "Wrong");

        return `
            <div class="quiz-card" style="margin-top:10px;">
                <div class="quiz-meta">Q${index + 1}</div>
                <div class="quiz-question">${q.question}</div>
                <div class="quiz-meta">Your answer: ${selectedText}</div>
                <div class="quiz-meta">Correct answer: ${correctText}</div>
                <div class="quiz-meta">Your answer is: ${statusText}</div>
            </div>
        `;
    }).join("");

    const quizLabel = currentQuiz.isDaily ? "Daily 5" : currentQuiz.isExam ? "Exam Mode" : "Quiz";
    content.innerHTML = `
        <h2>Class ${currentQuiz.classNumber} ${quizLabel} Review</h2>
        <div class="quiz-card" style="margin-bottom:10px;">
            <div class="quiz-question">Score: ${computedScore} / ${total}</div>
            <div class="quiz-kudos ${reviewKudosClass}">${reviewKudos}</div>
        </div>
        <div class="quiz-actions" style="margin-bottom:10px;">
            <button class="quiz-btn primary" onclick="renderQuizResult()">Result</button>
            ${hasHighScoreCelebration ? '<button class="quiz-btn secondary" onclick="showCurrentQuizHighScorePopup()">Show Congrats Pop</button>' : ""}
            <button class="quiz-btn secondary" onclick="startQuiz()">Restart</button>
        </div>
        ${reviewItems}
    `;
}

function renderQuizQuestion() {
    if (!currentQuiz) {
        return;
    }

    const content = document.getElementById("content");
    if (!content) {
        return;
    }

    const q = currentQuiz.questions[currentQuiz.index];
    currentQuiz.selected = currentQuiz.responses[currentQuiz.index];
    const isDaily = currentQuiz.isDaily;
    const isExam = currentQuiz.isExam;
    const rangeStart = currentQuiz.index * 10 + 1;
    const rangeEnd = rangeStart + 9;
    const quizTitle = isDaily ? "Daily 5" : isExam ? "Exam Mode (20 Questions)" : "Quiz (10 Questions)";
    const quizMeta = isDaily || isExam
        ? `Question ${currentQuiz.index + 1} of ${currentQuiz.questions.length}`
        : `Question ${currentQuiz.index + 1} of ${currentQuiz.questions.length} • Level Q${rangeStart}-Q${rangeEnd}`;
    const options = q.options.map(function (optionText, index) {
        const selectedClass = currentQuiz.selected === index ? "selected" : "";
        return `<button class="quiz-option ${selectedClass}" onclick="selectQuizOption(${index})">${optionText}</button>`;
    }).join("");

    content.innerHTML = `
        <h2>Class ${currentQuiz.classNumber} ${quizTitle}</h2>
        <div class="quiz-card">
            <div class="quiz-meta">${quizMeta}</div>
            <div id="quiz-timer" class="quiz-timer">Time left: 15s</div>
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-options">${options}</div>
            <div class="quiz-actions">
                <button class="quiz-btn secondary" onclick="goToPreviousQuizQuestion()" ${currentQuiz.index === 0 ? "disabled" : ""}>Back</button>
                <button class="quiz-btn secondary" onclick="startQuiz()">Restart</button>
            </div>
            <div id="quiz-note" class="quiz-note"></div>
        </div>
    `;

    startQuizTimer();
}

function renderQuizResult() {
    if (!currentQuiz) {
        return;
    }

    const content = document.getElementById("content");
    if (!content) {
        return;
    }

    clearQuizTimer();

    const total = currentQuiz.questions.length;
    let computedScore = 0;
    for (let i = 0; i < total; i += 1) {
        if (currentQuiz.responses[i] === currentQuiz.questions[i].answer) {
            computedScore += 1;
        }
    }

    currentQuiz.score = computedScore;
    recordQuizInsights(computedScore, total);
    const celebration = getHighScoreCelebration(currentQuiz.score, total);
    const hasHighScoreCelebration = celebration.eligible;
    const isPerfect = celebration.isPerfect;

    if (hasHighScoreCelebration) {
        showCelebrationPopup(celebration.popupText, isPerfect);
        saveHighScoreCelebration(currentQuiz.classNumber, currentQuiz.score, total, celebration);
        try {
            playPerfectScoreSound();
        } catch (error) {
            // Keep visual celebration even if browser blocks audio.
        }
        currentQuiz.celebrationShown = true;
    } else {
        clearSavedCelebrationForClass(currentQuiz.classNumber);
    }
    const bannerText = isPerfect
        ? "Congratulations! Perfect Score! 10/10 - Outstanding work!"
        : "Congratulations! Excellent Score! 9/10 - Great effort!";
    const kudosText = isPerfect
        ? "Kudos: You reached a perfect 10/10."
        : currentQuiz.score >= 9
            ? "Kudos: You reached an excellent 9/10."
            : currentQuiz.score >= 7
                ? "Kudos: Strong attempt. Keep pushing to 10/10."
                : "Kudos: Nice start. Practice and improve step by step.";
    const kudosClass = isPerfect
        ? "kudos-perfect"
        : currentQuiz.score >= 9
            ? "kudos-excellent"
            : "kudos-default";
    const celebrationMarkup = hasHighScoreCelebration
        ? `
            <div class="perfect-banner">${bannerText}</div>
            <div class="confetti-wrap" aria-hidden="true">
                <span class="confetti c1"></span>
                <span class="confetti c2"></span>
                <span class="confetti c3"></span>
                <span class="confetti c4"></span>
                <span class="confetti c5"></span>
                <span class="confetti c6"></span>
                <span class="confetti c7"></span>
                <span class="confetti c8"></span>
                <span class="confetti c9"></span>
                <span class="confetti c10"></span>
            </div>
        `
        : "";
    const resultCardClass = isPerfect
        ? "perfect-card"
        : hasHighScoreCelebration
            ? "excellent-card"
            : "";

    const quizLabel = currentQuiz.isDaily ? "Daily 5" : currentQuiz.isExam ? "Exam Mode" : "Quiz";
    content.innerHTML = `
        <h2>Class ${currentQuiz.classNumber} ${quizLabel} Result</h2>
        <div class="quiz-card ${resultCardClass}">
            ${celebrationMarkup}
            <div class="quiz-question">Score: ${currentQuiz.score} / ${total}</div>
            <div class="quiz-kudos ${kudosClass}">${kudosText}</div>
            <div class="quiz-actions">
                <button class="quiz-btn primary" onclick="startQuiz()">Try Again</button>
                <button class="quiz-btn secondary" onclick="renderQuizReview()">Review Questions</button>
                <button class="quiz-btn secondary" onclick="showNotes('physics')">Back to Notes</button>
            </div>
        </div>
    `;
}

function playPerfectScoreSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
        return;
    }

    const context = new AudioCtx();
    const now = context.currentTime;

    // Short burst sequence to simulate applause/clap celebration.
    for (let i = 0; i < 8; i += 1) {
        const offset = now + i * 0.09;
        const noiseBuffer = context.createBuffer(1, context.sampleRate * 0.07, context.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let j = 0; j < data.length; j += 1) {
            data[j] = (Math.random() * 2 - 1) * (1 - j / data.length);
        }

        const noise = context.createBufferSource();
        noise.buffer = noiseBuffer;

        const bandPass = context.createBiquadFilter();
        bandPass.type = "bandpass";
        bandPass.frequency.setValueAtTime(1400, offset);
        bandPass.Q.setValueAtTime(0.9, offset);

        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0001, offset);
        gain.gain.exponentialRampToValueAtTime(0.35, offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, offset + 0.07);

        noise.connect(bandPass);
        bandPass.connect(gain);
        gain.connect(context.destination);
        noise.start(offset);
        noise.stop(offset + 0.08);
    }

    setTimeout(function () {
        context.close();
    }, 1500);
}

function decorateNotesContent(contentElement) {
    const headings = contentElement.querySelectorAll("h3");
    headings.forEach(function (heading) {
        heading.classList.add("section-title");
    });

    const paragraphs = contentElement.querySelectorAll("p");
    paragraphs.forEach(function (paragraph) {
        paragraph.classList.add("formula-line");
        if (paragraph.textContent.trim().toLowerCase().startsWith("please select")) {
            paragraph.classList.add("info-line");
        }
    });
}

function applyNotesTheme(subject, contentElement) {
    contentElement.classList.remove("theme-physics");
    contentElement.classList.remove("theme-maths");
    contentElement.classList.remove("theme-chemistry");
    if (currentViewMode !== "attractive") {
        return;
    }

    if (subject === "physics") {
        contentElement.classList.add("theme-physics");
    } else if (subject === "maths") {
        contentElement.classList.add("theme-maths");
    } else if (subject === "chemistry") {
        contentElement.classList.add("theme-chemistry");
    }
}

function setPageTitleFromClass() {
    const titleElement = document.getElementById("page-title");
    if (!titleElement) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const classNumber = params.get("class");

    if (classNumber) {
        titleElement.textContent = `Class ${classNumber} FormulaNest`;
    }

    updateQuizButtonLabel(classNumber);
    setNotesQuote(null, classNumber);
}

function setNotesQuote(subject, classNumber) {
    const quoteElement = document.getElementById("notes-quote");
    if (!quoteElement) {
        return;
    }

    const currentClass = classNumber || new URLSearchParams(window.location.search).get("class") || "";
    const classQuotes = {
        "6": {
            default: "Start simple. Strong basics create strong toppers.",
            physics: "Measure it, move it, understand it - physics begins with observation.",
            maths: "Small arithmetic habits today become fast problem-solving tomorrow.",
            chemistry: "Matter is everywhere; learning it helps you read the world better."
        },
        "7": {
            default: "Class 7 is where curiosity starts turning into clarity.",
            physics: "Speed and work teach one rule: every result has a reason.",
            maths: "Ratios and integers train your brain to compare smartly.",
            chemistry: "Changes in matter show that science is action, not memorization."
        },
        "8": {
            default: "Class 8 builds the bridge from basics to advanced science.",
            physics: "Force and pressure explain how every push creates an effect.",
            maths: "Identities are shortcuts - master them once, use them forever.",
            chemistry: "Atoms and valency are the alphabet of chemistry."
        },
        "9": {
            default: "Class 9 is your foundation year for competitive thinking.",
            physics: "Motion and energy are the language of real-world physics.",
            maths: "From Heron to circles, Class 9 maths trains visual reasoning.",
            chemistry: "Mole concept is not hard - it is just counting at scale."
        },
        "10": {
            default: "Class 10 focus today creates exam confidence tomorrow.",
            physics: "Electricity and light reward students who practice formulas daily.",
            maths: "Quadratics and trigonometry become easy when revision is consistent.",
            chemistry: "Reactions, pH, and carbon - Class 10 chemistry needs smart revision."
        }
    };

    const selectedClassQuotes = classQuotes[currentClass] || {
        default: "Choose a subject, and turn formulas into confidence.",
        physics: "Physics teaches you to think with logic, not guesswork.",
        maths: "Maths is practice plus patterns - every step makes you faster.",
        chemistry: "Chemistry connects tiny atoms to big real-world changes."
    };

    const key = subject === "physics" || subject === "maths" || subject === "chemistry" ? subject : "default";
    const quoteText = selectedClassQuotes[key] || selectedClassQuotes.default;
    const prefix = currentClass ? `Class ${currentClass}: ` : "";
    quoteElement.textContent = `${prefix}"${quoteText}"`;
}

function renderParentView() {
    const container = document.getElementById("parent-dashboard");
    if (!container) {
        return;
    }

    const stats = loadParentStats();
    const history = loadSessionHistory();
    const last = stats.lastActivity;

    const lastActivityMarkup = last
        ? `
            <div class="parent-meta">Class ${last.classNumber || "-"} • ${getSessionSubjectLabel(last.subject || "")}</div>
            <div class="parent-meta">${formatSessionTime(last.savedAt)}</div>
            <div class="parent-meta">View: ${last.viewMode || "-"}</div>
        `
        : "<p>No activity yet.</p>";

    const quizKeys = stats.quizzes ? Object.keys(stats.quizzes) : [];
    const quizItems = quizKeys.sort(function (a, b) {
        return Number(a) - Number(b);
    }).map(function (key) {
        const entry = stats.quizzes[key];
        const when = entry && entry.savedAt ? formatSessionTime(entry.savedAt) : "-";
        const score = entry ? `${entry.score} / ${entry.total}` : "-";
        return `<li>Class ${key}: ${score}<br><small>${when}</small></li>`;
    }).join("");

    const quizMarkup = quizItems
        ? `<ul class="parent-list">${quizItems}</ul>`
        : "<p>No quiz results yet.</p>";

    const historyItems = history.slice(0, 6).map(function (entry) {
        const title = `Class ${entry.classNumber} - ${getSessionSubjectLabel(entry.subject)}`;
        const when = formatSessionTime(entry.savedAt);
        return `<li>${title}<br><small>${when}</small></li>`;
    }).join("");

    const historyMarkup = historyItems
        ? `<ul class="parent-list">${historyItems}</ul>`
        : "<p>No sessions yet.</p>";
    const classNumber = getLatestQuizClassFromStats(stats);
    const weakPanelMarkup = renderWeakTopicPanel(classNumber);

    container.innerHTML = `
        <div class="parent-card">
            <h3>Latest Activity</h3>
            ${lastActivityMarkup}
        </div>
        <div class="parent-card">
            <h3>Latest Quiz Results</h3>
            ${quizMarkup}
        </div>
        <div class="parent-card">
            <h3>Recent Sessions</h3>
            ${historyMarkup}
        </div>
        ${weakPanelMarkup}
    `;
}

function renderNotesOverview(classNumber) {
    const content = document.getElementById("content");
    if (!content) {
        return;
    }

    const notesByClass = {
        "6": [
            ["Physics", "Speed = Distance / Time", "Distance = Speed × Time", "Time = Distance / Speed"],
            ["Maths", "Area of rectangle = l × b", "Area of square = a²", "Perimeter of square = 4a"],
            ["Chemistry", "Matter has mass and occupies space", "Solid, liquid, and gas are the 3 main states", "Physical change does not make a new substance"]
        ],
        "7": [
            ["Physics", "Speed = Distance / Time", "Work = Force × Distance", "Power = Work / Time"],
            ["Maths", "SI = (P × R × T) / 100", "a − (−b) = a + b", "Linear pair = 180°"],
            ["Chemistry", "Rusting needs oxygen and water", "Acid tastes sour", "Base tastes bitter and feels soapy"]
        ],
        "8": [
            ["Physics", "Force = Mass × Acceleration", "Pressure = Force / Area", "Power = Work / Time"],
            ["Maths", "(a + b)² = a² + 2ab + b²", "(a − b)² = a² − 2ab + b²", "a² − b² = (a − b)(a + b)"],
            ["Chemistry", "Atom contains proton, neutron, and electron", "Valency is combining capacity", "Fuel + O₂ → CO₂ + Heat + Light"]
        ],
        "9": [
            ["Physics", "Speed = Distance / Time", "Velocity = Displacement / Time", "Acceleration = (v − u) / t"],
            ["Maths", "Area = √[s(s−a)(s−b)(s−c)]", "Distance formula uses x and y coordinates", "Circumference = 2πr"],
            ["Chemistry", "1 mole = 6.022 × 10²³ particles", "Mass number = protons + neutrons", "Density = Mass / Volume"]
        ],
        "10": [
            ["Physics", "V = IR", "P = VI", "Energy = Power × Time"],
            ["Maths", "D = b² − 4ac", "AP nth term = a + (n−1)d", "sin²θ + cos²θ = 1"],
            ["Chemistry", "pH < 7 is acidic", "pH = 7 is neutral", "pH > 7 is basic"]
        ]
    };

    const overviewNotes = notesByClass[classNumber] || [
        ["Physics", "Speed = Distance / Time", "Work = Force × Distance", "Power = Work / Time"],
        ["Maths", "Practice identities and formulas daily", "Use the distance and area formulas often", "Revise step by step"],
        ["Chemistry", "Atoms make up matter", "Changes can be physical or chemical", "Learn formulas with examples"]
    ];

    const sections = overviewNotes.map(function (section) {
        return `
            <h3>${section[0]} Quick Notes</h3>
            <p>${section[1]}</p>
            <p>${section[2]}</p>
            <p>${section[3]}</p>
        `;
    }).join("");

    content.innerHTML = `
        <h2>Class ${classNumber || ""} Starter Notes</h2>
        <p>Use these quick notes first, then tap a subject for full formulas.</p>
        ${sections}
        ${renderOverviewVisualLearning(classNumber)}
    `;

    applyNotesTheme("physics", content);
    decorateNotesContent(content);
}

function showNotes(subject) {
    let content = document.getElementById("content");
    const params = new URLSearchParams(window.location.search);
    const classNumber = params.get("class");
    currentSubject = subject;

    if (!content) {
        return;
    }

    stopFormulaVoice();
    clearQuizTimer();
    highlightSubjectButton(subject);
    applyNotesTheme(subject, content);
    setNotesQuote(subject, classNumber);

    if (subject === "calculator") {
        showCalculator();
        return;
    }

    // Render formulas from FORMULAS dataset
    const subjectLower = String(subject || "").toLowerCase();
    const cls = Number(classNumber);
    
    if (FORMULAS && FORMULAS[cls] && FORMULAS[cls][subjectLower]) {
        const formulasList = FORMULAS[cls][subjectLower];
        let html = `<h2>${subjectLower.charAt(0).toUpperCase() + subjectLower.slice(1)} Notes - Class ${cls}</h2>`;
        
        let currentSection = '';
        formulasList.forEach(formula => {
            const [name, value] = formula;
            
            // If name is empty, it's a separator
            if (!name) {
                return;
            }
            
            // If value is empty, it's a section header
            if (!value) {
                if (currentSection) {
                    html += '';
                }
                currentSection = name;
                html += `<h3>${name}</h3>`;
            } else {
                // Regular formula
                html += `<p><strong>${name}:</strong> ${value}</p>`;
            }
        });
        
        content.innerHTML = html;
    } else {
        // Fallback if subject/class not in FORMULAS
        const subjectDisplay = subjectLower.charAt(0).toUpperCase() + subjectLower.slice(1);
        content.innerHTML = `
            <h2>${subjectDisplay} Notes - Class ${cls}</h2>
            <p>Formulas for this class and subject are coming soon!</p>
        `;
    }

    const visualLearningMarkup = renderVisualLearningSection(subjectLower);
    if (visualLearningMarkup) {
        content.insertAdjacentHTML("beforeend", visualLearningMarkup);
    }

    decorateNotesContent(content);
    saveCurrentSession(subject, classNumber);
}

setPageTitleFromClass();
registerServiceWorker();
syncViewModeButtons();
renderNotesOverview(new URLSearchParams(window.location.search).get("class"));
initSessionPanel();
renderParentView();
restoreSessionFromQuery();
autoOpenSubjectFromQuery();
autoStartQuizFromQuery();
ensureQuizButtonVisible();
restoreCelebrationAfterReload();
window.addEventListener("keydown", handleCalculatorKeyboard);

window.addEventListener("pageshow", function () {
    ensureQuizButtonVisible();
    updateQuizButtonLabel(new URLSearchParams(window.location.search).get("class"));
    restoreCelebrationAfterReload();
});
