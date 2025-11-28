// ===========================================================================================
// Core & Routing
// ===========================================================================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ===========================================================================================
// Layout & Shared Components
// ===========================================================================================
import Header from './components/Header';
import Footer from './components/Footer';

// ===========================================================================================
// Pages
// ===========================================================================================
import Home from './pages/Home';
import MathCalculators from './pages/MathCalculators';
import Financial from './pages/FinancialCalculators';
import HealthFitness from './pages/HealthFitnessCalculators';
import EducationCalculators from './pages/EducationCalculators';
import ConversionTools from './pages/ConversionTools';
import DateTimeCalculators from './pages/DateTimeCalculators';


// ===========================================================================================
// Math Calculators
// ===========================================================================================

// ----- Basic Math -----
import BasicCalculator from './pages/calculators/math_calculators/basic_math/BasicCalculator';
import ScientificCalculator from './pages/calculators/math_calculators/basic_math/ScientificCalculator';
import FractionCalculator from './pages/calculators/math_calculators/basic_math/FractionCalculator';
import AverageCalculator from './pages/calculators/math_calculators/basic_math/AverageCalculator';
import BigNumberCalculator from './pages/calculators/math_calculators/basic_math/BigNumberCalculator';
import ProportionCalculator from './pages/calculators/math_calculators/basic_math/ProportionCalculator';
import LongDivisionCalculator from './pages/calculators/math_calculators/basic_math/LongDivisionCalculator';
import CommonDenominatorCalculator from './pages/calculators/math_calculators/basic_math/CommonDenominatorCalculator';
import RatioCalculator from './pages/calculators/math_calculators/basic_math/RatioCalculator';
import PercentageCalculator from './pages/calculators/math_calculators/basic_math/PercentageCalculator';
import RoundingCalculator from './pages/calculators/math_calculators/basic_math/RoundingCalculator';

// ----- Fractions -----
import MixedNumberCalculator from './pages/calculators/math_calculators/fraction/MixedNumberCalculator';
import SimplifyFractionsCalculator from './pages/calculators/math_calculators/fraction/SimplifyFractionsCalculator';
import DecimalToFractionCalculator from './pages/calculators/math_calculators/fraction/DecimalToFractionCalculator';
import FractionToDecimalCalculator from './pages/calculators/math_calculators/fraction/FractionToDecimalCalculator';
import BigNumberFractionCalculator from './pages/calculators/math_calculators/fraction/BigNumberFractionCalculator';

// ----- Geometry -----
import AreaCalculator from './pages/calculators/math_calculators/geometry/AreaCalculator';
import VolumeCalculator from './pages/calculators/math_calculators/geometry/VolumeCalculator';
import PerimeterCalculator from './pages/calculators/math_calculators/geometry/PerimeterCalculator';
import TriangleCalculator from './pages/calculators/math_calculators/geometry/TriangleCalculator';
import SurfaceAreaCalculator from './pages/calculators/math_calculators/geometry/SurfaceAreaCalculator';
import RightTriangleCalculator from './pages/calculators/math_calculators/geometry/RightTriangleCalculator';
import CircleCalculator from './pages/calculators/math_calculators/geometry/CircleCalculator';
import PythagoreanTheoremCalculator from './pages/calculators/math_calculators/geometry/PythagoreanTheoremCalculator';
import DistanceCalculator from './pages/calculators/math_calculators/geometry/DistanceCalculator';

// ----- Algebra -----
import QuadraticFormulaCalculator from './pages/calculators/math_calculators/algebra/QuadraticFormulaCalculator';
import EquationSolver from './pages/calculators/math_calculators/algebra/EquationSolver';
import SystemOfEquations from './pages/calculators/math_calculators/algebra/SystemOfEquations';
import FactoringCalculator from './pages/calculators/math_calculators/algebra/FactoringCalculator';
import LogarithmCalculator from './pages/calculators/math_calculators/algebra/LogarithmCalculator';
import RootCalculator from './pages/calculators/math_calculators/algebra/RootCalculator';
import PolynomialCalculator from './pages/calculators/math_calculators/algebra/PolynomialCalculator';
import ExponentCalculator from './pages/calculators/math_calculators/algebra/ExponentCalculator';
import SlopeCalculator from './pages/calculators/math_calculators/algebra/SlopeCalculator';

// ----- Trigonometry -----
import TrigonometryCalculator from './pages/calculators/math_calculators/trigonometry/TrigonometryCalculator';
import LawOfSinesCalculator from './pages/calculators/math_calculators/trigonometry/LawOfSinesCalculator';
import LawOfCosinesCalculator from './pages/calculators/math_calculators/trigonometry/LawOfCosinesCalculator';
import UnitCircleCalculator from './pages/calculators/math_calculators/trigonometry/UnitCircleCalculator';
import InverseTrigCalculator from './pages/calculators/math_calculators/trigonometry/InverseTrigCalculator';

// ----- Statistics -----
import MeanMedianModeCalculator from './pages/calculators/math_calculators/statistics/MeanMedianModeCalculator';
import StandardDeviationCalculator from './pages/calculators/math_calculators/statistics/StandardDeviationCalculator';
import CentralTendencyCalculator from './pages/calculators/math_calculators/statistics/CentralTendencyCalculator';
import DescriptiveStatisticsCalculator from './pages/calculators/math_calculators/statistics/DescriptiveStatisticsCalculator';
import ProbabilityCalculator from './pages/calculators/math_calculators/statistics/ProbabilityCalculator';
import CombinationCalculator from './pages/calculators/math_calculators/statistics/CombinationCalculator';
import ZScoreCalculator from './pages/calculators/math_calculators/statistics/ZScoreCalculator';
import PermutationCombinationCalculator from './pages/calculators/math_calculators/statistics/PermutationCombinationCalculator';
import CorrelationCalculator from './pages/calculators/math_calculators/statistics/CorrelationCalculator';
import SampleSizeCalculator from './pages/calculators/math_calculators/statistics/SampleSizeCalculator';
import ConfidenceIntervalCalculator from './pages/calculators/math_calculators/statistics/ConfidenceIntervalCalculator';
import PValueCalculator from './pages/calculators/math_calculators/statistics/PValueCalculator';
import PercentErrorCalculator from './pages/calculators/math_calculators/statistics/PercentErrorCalculator';
import StatisticsCalculator from './pages/calculators/math_calculators/statistics/StatisticsCalculator';

// ----- Number Theory -----
import RandomNumberGenerator from './pages/calculators/math_calculators/number_theory/RandomNumberGenerator';
import FactorialCalculator from './pages/calculators/math_calculators/number_theory/FactorialCalculator';
import GCDCalculator from './pages/calculators/math_calculators/number_theory/GCDCalculator';
import LCMCalculator from './pages/calculators/math_calculators/number_theory/LCMCalculator';
import FibonacciCalculator from './pages/calculators/math_calculators/number_theory/FibonacciCalculator';
import NumberSequenceCalculator from './pages/calculators/math_calculators/number_theory/NumberSequenceCalculator';
import PrimeNumberCalculator from './pages/calculators/math_calculators/number_theory/PrimeNumberCalculator';
import PrimeFactorizationCalculator from './pages/calculators/math_calculators/number_theory/PrimeFactorizationCalculator';
import FactorCalculator from './pages/calculators/math_calculators/number_theory/FactorCalculator';

// ----- Matrix & Vectors -----
import MatrixCalculator from './pages/calculators/math_calculators/matrix_vectors/MatrixCalculator';
import DeterminantCalculator from './pages/calculators/math_calculators/matrix_vectors/DeterminantCalculator';
import EigenvalueCalculator from './pages/calculators/math_calculators/matrix_vectors/EigenvalueCalculator';
import CrossProduct from './pages/calculators/math_calculators/matrix_vectors/CrossProduct';
import DotProduct from './pages/calculators/math_calculators/matrix_vectors/DotProduct';
import VectorCalculator from './pages/calculators/math_calculators/matrix_vectors/VectorCalculator';

// ----- Number Systems -----
import BinaryCalculator from './pages/calculators/math_calculators/number_systems/BinaryCalculator';
import NumberBaseConverter from './pages/calculators/math_calculators/number_systems/NumberBaseConverter';
import HexCalculator from './pages/calculators/math_calculators/number_systems/HexCalculator';
import ScientificNotationCalculator from './pages/calculators/math_calculators/number_systems/ScientificNotationCalculator';

// ----- Calculus -----
import DerivativeCalculator from './pages/calculators/math_calculators/calculus/DerivativeCalculator';
import IntegralCalculator from './pages/calculators/math_calculators/calculus/IntegralCalculator';
import LimitCalculator from './pages/calculators/math_calculators/calculus/LimitCalculator';
import SeriesCalculator from './pages/calculators/math_calculators/calculus/SeriesCalculator';
import TaylorSeriesCalculator from './pages/calculators/math_calculators/calculus/TaylorSeriesCalculator';

// ----- Specialized -----
import HalfLifeCalculator from './pages/calculators/math_calculators/specialized/HalfLifeCalculator';

// ===========================================================================================
// Financial Calculators
// ===========================================================================================
import MortgageCalculator from './pages/calculators/financial_calculators/MortgageCalculator';
import LoanCalculator from './pages/calculators/financial_calculators/LoanCalculator';
import AutoLoanCalculator from './pages/calculators/financial_calculators/AutoLoanCalculator';
import InterestCalculator from './pages/calculators/financial_calculators/InterestCalculator';
import InvestmentCalculator from './pages/calculators/financial_calculators/InvestmentCalculator';
import CompoundInterestCalculator from './pages/calculators/financial_calculators/CompoundInterestCalculator';
import SIPCalculator from './pages/calculators/financial_calculators/SIPCalculator';
import SWPCalculator from './pages/calculators/financial_calculators/SWPCalculator';
import PaymentCalculator from './pages/calculators/financial_calculators/PaymentCalculator';
import AmortizationCalculator from './pages/calculators/financial_calculators/AmortizationCalculator';
import RetirementCalculators from './pages/calculators/financial_calculators/RetirementCalculator';
import InflationCalculator from './pages/calculators/financial_calculators/InflationCalculator';
import IncomeTaxCalculator from './pages/calculators/financial_calculators/IncomeTaxCalculator';
import TaxCalculator from './pages/calculators/financial_calculators/TaxCalculator';
import SalesTaxCalculator from './pages/calculators/financial_calculators/SalesTaxCalculator';
import SalaryCalculator from './pages/calculators/financial_calculators/SalaryCalculator';
import InterestRateCalculator from './pages/calculators/financial_calculators/InterestRateCalculator';
import TipCalculator from './pages/calculators/financial_calculators/TipCalculator';
import CurrencyConverter from './pages/calculators/financial_calculators/CurrencyConverter';

// ===========================================================================================
// Health & Fitness Calculators
// ===========================================================================================
import BMICalculator from './pages/calculators/health-fitness/BMICalculator';
import BodyFatCalculator from './pages/calculators/health-fitness/BodyFatCalculator';
import CalorieCalculator from './pages/calculators/health-fitness/CalorieCalculator';
import HeartRateCalculator from './pages/calculators/health-fitness/HeartRateCalculator';
import PregnancyCalculator from './pages/calculators/health-fitness/PregnancyCalculator';
import WaterIntakeCalculator from './pages/calculators/health-fitness/WaterIntakeCalculator';

// ===========================================================================================
// Conversion Tools
// ===========================================================================================
import UnitConverter from './pages/calculators/conversion_tool/UnitConverter';
import TemperatureConverter from './pages/calculators/conversion_tool/TemperatureConverter';
import LengthConverter from './pages/calculators/conversion_tool/LengthConverter';
import WeightConverter from './pages/calculators/conversion_tool/WeightConverter';
import VolumeConverter from './pages/calculators/conversion_tool/VolumeConverter';
import AreaConverter from './pages/calculators/conversion_tool/AreaConverter';
import SpeedConverter from './pages/calculators/conversion_tool/SpeedConverter';
import EnergyConverter from './pages/calculators/conversion_tool/EnergyConverter';
// ===========================================================================================
// Date & Time Calculators
// ===========================================================================================
import DateCalculator from './pages/calculators/date_time/DateCalculator';
import AgeCalculator from './pages/calculators/date_time/AgeCalculator';
import TimeZoneConverter from './pages/calculators/date_time/TimeZoneConverter';
import BusinessDaysCalculator from './pages/calculators/date_time/BusinessDaysCalculator';
import TimeDurationCalculator from './pages/calculators/date_time/TimeDurationCalculator';
import CountdownCalculator from './pages/calculators/date_time/CountdownCalculator';

// ===========================================================================================
// Education Calculators
// ===========================================================================================
import GradeCalculator from './pages/calculators/education/GradeCalculator';
import GPACalculator from './pages/calculators/education/GPACalculator';
import TestScoreCalculator from './pages/calculators/education/TestScoreCalculator';
import StudyTimeCalculator  from './pages/calculators/education/StudyTimeCalculator';
import ReadingTimeCalculator from './pages/calculators/education/ReadingTimeCalculator';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* ======================== Core Pages ======================== */}
            <Route path="/" element={<Home />} />
            <Route path="/math-calculators" element={<MathCalculators />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/health-fitness" element={<HealthFitness />} />
            <Route path="/education" element={<EducationCalculators />} />
            <Route path="/conversion-tools" element={<ConversionTools />} />
            <Route path="/date-time" element={<DateTimeCalculators />} />

            {/* ======================== Basic Math ======================== */}
            <Route path="/basic-calculator" element={<BasicCalculator />} />
            <Route path="/scientific-calculator" element={<ScientificCalculator />} />
            <Route path="/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/fraction-calculator" element={<FractionCalculator />} />
            <Route path="/average-calculator" element={<AverageCalculator />} />
            <Route path="/big-number-calculator" element={<BigNumberCalculator />} />
            <Route path="/proportion-calculator" element={<ProportionCalculator />} />
            <Route path="/long-division-calculator" element={<LongDivisionCalculator />} />
            <Route path="/common-denominator-calculator" element={<CommonDenominatorCalculator />} />
            <Route path="/ratio-calculator" element={<RatioCalculator />} />
            <Route path="/rounding-calculator" element={<RoundingCalculator />} />

            {/* ======================== Fractions ======================== */}
            <Route path="/mixed-number-calculator" element={<MixedNumberCalculator />} />
            <Route path="/simplify-fractions-calculator" element={<SimplifyFractionsCalculator />} />
            <Route path="/decimal-to-fraction-calculator" element={<DecimalToFractionCalculator />} />
            <Route path="/fraction-to-decimal-calculator" element={<FractionToDecimalCalculator />} />
            <Route path="/big-number-fraction-calculator" element={<BigNumberFractionCalculator />} />

            {/* ======================== Geometry ======================== */}
            <Route path="/area-calculator" element={<AreaCalculator />} />
            <Route path="/volume-calculator" element={<VolumeCalculator />} />
            <Route path="/perimeter-calculator" element={<PerimeterCalculator />} />
            <Route path="/triangle-calculator" element={<TriangleCalculator />} />
            <Route path="/surface-area-calculator" element={<SurfaceAreaCalculator />} />
            <Route path="/right-triangle-calculator" element={<RightTriangleCalculator />} />
            <Route path="/circle-calculator" element={<CircleCalculator />} />
            <Route path="/pythagorean-theorem" element={<PythagoreanTheoremCalculator />} />
            <Route path="/distance-calculator" element={<DistanceCalculator />} />

            {/* ======================== Algebra ======================== */}
            <Route path="/quadratic-formula" element={<QuadraticFormulaCalculator />} />
            <Route path="/equation-solver" element={<EquationSolver />} />
            <Route path="/system-of-equations" element={<SystemOfEquations />} />
            <Route path="/factoring-calculator" element={<FactoringCalculator />} />
            <Route path="/logarithm-calculator" element={<LogarithmCalculator />} />
            <Route path="/root-calculator" element={<RootCalculator />} />
            <Route path="/polynomial-calculator" element={<PolynomialCalculator />} />
            <Route path="/exponent-calculator" element={<ExponentCalculator />} />
            <Route path="/slope-calculator" element={<SlopeCalculator />} />

            {/* ======================== Trigonometry ======================== */}
            <Route path="/trigonometry-calculator" element={<TrigonometryCalculator />} />
            <Route path="/law-of-sines" element={<LawOfSinesCalculator />} />
            <Route path="/law-of-cosines" element={<LawOfCosinesCalculator />} />
            <Route path="/unit-circle-calculator" element={<UnitCircleCalculator />} />
            <Route path="/inverse-trig-calculator" element={<InverseTrigCalculator />} />

            {/* ======================== Statistics ======================== */}
            <Route path="/statistics-calculator" element={<StatisticsCalculator />} />
            <Route path="/mean-median-mode-calculator" element={<MeanMedianModeCalculator />} />
            <Route path="/standard-deviation-calculator" element={<StandardDeviationCalculator />} />
            <Route path="/central-tendency-calculator" element={<CentralTendencyCalculator />} />
            <Route path="/descriptive-statistics-calculator" element={<DescriptiveStatisticsCalculator />} />
            <Route path="/probability-calculator" element={<ProbabilityCalculator />} />
            <Route path="/combination-calculator" element={<CombinationCalculator />} />
            <Route path="/z-score-calculator" element={<ZScoreCalculator />} />
            <Route path="/permutation-combination-calculator" element={<PermutationCombinationCalculator />} />
            <Route path="/correlation-calculator" element={<CorrelationCalculator />} />
            <Route path="/sample-size-calculator" element={<SampleSizeCalculator />} />
            <Route path="/confidence-interval-calculator" element={<ConfidenceIntervalCalculator />} />
            <Route path="/p-value-calculator" element={<PValueCalculator />} />
            <Route path="/percent-error-calculator" element={<PercentErrorCalculator />} />

            {/* ======================== Number Theory ======================== */}
            <Route path="/random-number-generator" element={<RandomNumberGenerator />} />
            <Route path="/factorial-calculator" element={<FactorialCalculator />} />
            <Route path="/gcd-calculator" element={<GCDCalculator />} />
            <Route path="/lcm-calculator" element={<LCMCalculator />} />
            <Route path="/fibonacci-calculator" element={<FibonacciCalculator />} />
            <Route path="/number-sequence-calculator" element={<NumberSequenceCalculator />} />
            <Route path="/prime-number-calculator" element={<PrimeNumberCalculator />} />
            <Route path="/prime-factorization-calculator" element={<PrimeFactorizationCalculator />} />
            <Route path="/factor-calculator" element={<FactorCalculator />} />

            {/* ======================== Matrix & Vectors ======================== */}
            <Route path="/matrix-calculator" element={<MatrixCalculator />} />
            <Route path="/determinant-calculator" element={<DeterminantCalculator />} />
            <Route path="/eigenvalue-calculator" element={<EigenvalueCalculator />} />
            <Route path="/cross-product" element={<CrossProduct />} />
            <Route path="/dot-product" element={<DotProduct />} />
            <Route path="/vector-calculator" element={<VectorCalculator />} />

            {/* ======================== Number Systems ======================== */}
            <Route path="/binary-calculator" element={<BinaryCalculator />} />
            <Route path="/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/hex-calculator" element={<HexCalculator />} />
            <Route path="/scientific-notation-calculator" element={<ScientificNotationCalculator />} />

            {/* ======================== Calculus ======================== */}
            <Route path="/derivative-calculator" element={<DerivativeCalculator />} />
            <Route path="/integral-calculator" element={<IntegralCalculator />} />
            <Route path="/limit-calculator" element={<LimitCalculator />} />
            <Route path="/series-calculator" element={<SeriesCalculator />} />
            <Route path="/taylor-series" element={<TaylorSeriesCalculator />} />

            {/* ======================== Specialized ======================== */}
            <Route path="/half-life-calculator" element={<HalfLifeCalculator />} />

            {/* ======================== Financial Calculators ======================== */}
            <Route path="/financial" element={<Financial />} />
            <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/loan-calculator" element={<LoanCalculator />} />
            <Route path="/auto-loan-calculator" element={<AutoLoanCalculator />} />
            <Route path="/interest-calculator" element={<InterestCalculator />} />
            <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
            <Route path="/investment-calculator" element={<InvestmentCalculator />} />
            <Route path="/sip-calculator" element={<SIPCalculator />} />
            <Route path="/swp-calculator" element={<SWPCalculator />} />
            <Route path="/payment-calculator" element={<PaymentCalculator />} />
            <Route path="/amortization-calculator" element={<AmortizationCalculator />} />
            <Route path="/retirement-calculator" element={<RetirementCalculators />} />
            <Route path="/inflation-calculator" element={<InflationCalculator />} />
            <Route path="/income-tax-calculator" element={<IncomeTaxCalculator />} />
            <Route path="/tax-calculator" element={<TaxCalculator />} />
            <Route path="/sales-tax-calculator" element={<SalesTaxCalculator />} />
            <Route path="/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/interest-rate-calculator" element={<InterestRateCalculator />} />
            <Route path="/tip-calculator" element={<TipCalculator />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />

            {/* ======================== Health & Fitness ======================== */}
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/body-fat-calculator" element={<BodyFatCalculator />} />
            <Route path="/calorie-calculator" element={<CalorieCalculator />} />
            <Route path="/heart-rate-calculator" element={<HeartRateCalculator />} />
            <Route path="/pregnancy-calculator" element={<PregnancyCalculator />} />
            <Route path="/water-intake-calculator" element={<WaterIntakeCalculator />} />

            {/* ======================== Conversion Tools ======================== */}
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/temperature-converter" element={<TemperatureConverter />} />
            <Route path="/length-converter" element={<LengthConverter />} />
            <Route path="/weight-converter" element={<WeightConverter />} />
            <Route path="/volume-converter" element={<VolumeConverter />} />
            <Route path="/area-converter" element={<AreaConverter />} />
            <Route path="/speed-converter" element={<SpeedConverter />} />
            <Route path="/energy-converter" element={<EnergyConverter />} />

            {/* ======================== Date & Time ======================== */}
            <Route path="/date-calculator" element={<DateCalculator />} />
            <Route path="/age-calculator" element={<AgeCalculator />} />
            <Route path="/time-zone-converter" element={<TimeZoneConverter />} />
            <Route path="/business-days-calculator" element={<BusinessDaysCalculator />} />
            <Route path="/time-duration-calculator" element={<TimeDurationCalculator />} />
            <Route path="/countdown-calculator" element={<CountdownCalculator />} />

            {/* ======================== Education ======================== */}
            <Route path="/grade-calculator" element={<GradeCalculator />} />
            <Route path="/gpa-calculator" element={< GPACalculator />} />
            <Route path="/test-score-calculator" element={<TestScoreCalculator />} />
            <Route path="/study-time-calculator" element={<StudyTimeCalculator />} />
            <Route path="/reading-time-calculator" element={<ReadingTimeCalculator />} />

            {/* ======================== 404 Not Found ======================== */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;