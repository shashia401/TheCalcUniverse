import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, GraduationCap, Plus, Trash2 } from 'lucide-react';

interface Grade {
  id: string;
  assignment: string;
  score: string;
  maxScore: string;
  weight: string;
}

const GradeCalculator: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([
    { id: '1', assignment: '', score: '', maxScore: '', weight: '' }
  ]);
  const [calculationType, setCalculationType] = useState<'weighted' | 'unweighted'>('unweighted');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateGrade();
  }, [grades, calculationType]);

  const addGrade = () => {
    const newGrade: Grade = {
      id: Date.now().toString(),
      assignment: '',
      score: '',
      maxScore: '',
      weight: ''
    };
    setGrades([...grades, newGrade]);
  };

  const removeGrade = (id: string) => {
    if (grades.length > 1) {
      setGrades(grades.filter(grade => grade.id !== id));
    }
  };

  const updateGrade = (id: string, field: keyof Grade, value: string) => {
    setGrades(grades.map(grade => 
      grade.id === id ? { ...grade, [field]: value } : grade
    ));
  };

  const calculateGrade = () => {
    const validGrades = grades.filter(grade => 
      grade.score && grade.maxScore && 
      !isNaN(parseFloat(grade.score)) && !isNaN(parseFloat(grade.maxScore))
    );

    if (validGrades.length === 0) {
      setResults(null);
      return;
    }

    if (calculationType === 'unweighted') {
      const totalPoints = validGrades.reduce((sum, grade) => 
        sum + parseFloat(grade.score), 0
      );
      const totalMaxPoints = validGrades.reduce((sum, grade) => 
        sum + parseFloat(grade.maxScore), 0
      );
      
      const percentage = (totalPoints / totalMaxPoints) * 100;
      const letterGrade = getLetterGrade(percentage);

      setResults({
        percentage: percentage.toFixed(2),
        letterGrade,
        totalPoints,
        totalMaxPoints,
        assignments: validGrades.length
      });
    } else {
      // Weighted calculation
      const validWeightedGrades = validGrades.filter(grade => 
        grade.weight && !isNaN(parseFloat(grade.weight))
      );

      if (validWeightedGrades.length === 0) {
        setResults(null);
        return;
      }

      let weightedSum = 0;
      let totalWeight = 0;

      validWeightedGrades.forEach(grade => {
        const score = parseFloat(grade.score);
        const maxScore = parseFloat(grade.maxScore);
        const weight = parseFloat(grade.weight);
        
        const gradePercentage = (score / maxScore) * 100;
        weightedSum += gradePercentage * weight;
        totalWeight += weight;
      });

      const finalPercentage = weightedSum / totalWeight;
      const letterGrade = getLetterGrade(finalPercentage);

      setResults({
        percentage: finalPercentage.toFixed(2),
        letterGrade,
        weightedSum: weightedSum.toFixed(2),
        totalWeight,
        assignments: validWeightedGrades.length
      });
    }
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  const getGradeColor = (letterGrade: string) => {
    if (letterGrade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (letterGrade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (letterGrade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (letterGrade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/education" className="hover:text-blue-600 transition-colors">Education Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Grade Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <GraduationCap className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Grade Calculator</h1>
            </div>

            {/* Calculation Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
              <button
                onClick={() => setCalculationType('unweighted')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  calculationType === 'unweighted' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unweighted
              </button>
              <button
                onClick={() => setCalculationType('weighted')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  calculationType === 'weighted' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Weighted
              </button>
            </div>

            {/* Grade Inputs */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700">
                <div className="col-span-4">Assignment</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-2">Max Score</div>
                {calculationType === 'weighted' && <div className="col-span-2">Weight (%)</div>}
                <div className="col-span-2">Percentage</div>
                <div className="col-span-1"></div>
              </div>

              {grades.map((grade, index) => {
                const percentage = grade.score && grade.maxScore 
                  ? ((parseFloat(grade.score) / parseFloat(grade.maxScore)) * 100).toFixed(1)
                  : '';

                return (
                  <div key={grade.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={grade.assignment}
                        onChange={(e) => updateGrade(grade.id, 'assignment', e.target.value)}
                        placeholder={`Assignment ${index + 1}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={grade.score}
                        onChange={(e) => updateGrade(grade.id, 'score', e.target.value)}
                        placeholder="85"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={grade.maxScore}
                        onChange={(e) => updateGrade(grade.id, 'maxScore', e.target.value)}
                        placeholder="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    {calculationType === 'weighted' && (
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={grade.weight}
                          onChange={(e) => updateGrade(grade.id, 'weight', e.target.value)}
                          placeholder="20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    <div className={`col-span-2 text-center font-medium ${percentage ? 'text-gray-900' : 'text-gray-400'}`}>
                      {percentage ? `${percentage}%` : '--'}
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeGrade(grade.id)}
                        disabled={grades.length === 1}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addGrade}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-6"
            >
              <Plus className="w-4 h-4" />
              <span>Add Assignment</span>
            </button>

            {/* Results */}
            {results && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Grade Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {results.percentage}%
                    </div>
                    <div className="text-gray-600">Overall Percentage</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getGradeColor(results.letterGrade)}`}>
                      {results.letterGrade}
                    </div>
                    <div className="text-gray-600 mt-2">Letter Grade</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900">{results.assignments}</div>
                    <div className="text-sm text-gray-600">Assignments</div>
                  </div>
                  
                  {calculationType === 'unweighted' ? (
                    <>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-lg font-semibold text-gray-900">{results.totalPoints}</div>
                        <div className="text-sm text-gray-600">Points Earned</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-lg font-semibold text-gray-900">{results.totalMaxPoints}</div>
                        <div className="text-sm text-gray-600">Total Points</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-lg font-semibold text-gray-900">{results.weightedSum}</div>
                        <div className="text-sm text-gray-600">Weighted Sum</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-lg font-semibold text-gray-900">{results.totalWeight}%</div>
                        <div className="text-sm text-gray-600">Total Weight</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Grading Scale</h2>
            <div className="space-y-2 text-sm">
              {[
                { grade: 'A+', range: '97-100%', color: 'bg-green-500' },
                { grade: 'A', range: '93-96%', color: 'bg-green-400' },
                { grade: 'A-', range: '90-92%', color: 'bg-green-300' },
                { grade: 'B+', range: '87-89%', color: 'bg-blue-500' },
                { grade: 'B', range: '83-86%', color: 'bg-blue-400' },
                { grade: 'B-', range: '80-82%', color: 'bg-blue-300' },
                { grade: 'C+', range: '77-79%', color: 'bg-yellow-500' },
                { grade: 'C', range: '73-76%', color: 'bg-yellow-400' },
                { grade: 'C-', range: '70-72%', color: 'bg-yellow-300' },
                { grade: 'D+', range: '67-69%', color: 'bg-orange-500' },
                { grade: 'D', range: '65-66%', color: 'bg-orange-400' },
                { grade: 'D-', range: '60-64%', color: 'bg-orange-300' },
                { grade: 'F', range: 'Below 60%', color: 'bg-red-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="font-medium">{item.grade}</span>
                  </div>
                  <span className="text-gray-600 text-xs">{item.range}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Calculation Methods</h3>
            <div className="space-y-3 text-indigo-800 text-sm">
              <div>
                <h4 className="font-semibold">Unweighted</h4>
                <p>All assignments have equal importance. Total points earned divided by total possible points.</p>
              </div>
              <div>
                <h4 className="font-semibold">Weighted</h4>
                <p>Assignments have different weights/importance. Each grade is multiplied by its weight percentage.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Study Tips</h3>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• Focus on high-weight assignments</li>
              <li>• Track your progress regularly</li>
              <li>• Identify areas for improvement</li>
              <li>• Set realistic grade goals</li>
              <li>• Plan time for test preparation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;