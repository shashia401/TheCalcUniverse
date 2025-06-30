import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, X, Plus } from 'lucide-react';

type Course = {
  id: number;
  name: string;
  grade: string;
  credits: string;
  weight: string;
};

type Semester = {
  id: number;
  weighted: boolean;
  courses: Course[];
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
};

const gradeOptions = [
  { label: 'A+', value: 4.0 },
  { label: 'A', value: 4.0 },
  { label: 'A-', value: 3.7 },
  { label: 'B+', value: 3.3 },
  { label: 'B', value: 3.0 },
  { label: 'B-', value: 2.7 },
  { label: 'C+', value: 2.3 },
  { label: 'C', value: 2.0 },
  { label: 'C-', value: 1.7 },
  { label: 'D+', value: 1.3 },
  { label: 'D', value: 1.0 },
  { label: 'D-', value: 0.7 },
  { label: 'F', value: 0.0 },
];

const weightOptions = [
  { label: 'Regular', value: 0.0 },
  { label: 'Honors', value: 0.5 },
  { label: 'AP / IB', value: 1.0 },
  { label: 'College', value: 1.0 },
];

const HowToSection = () => (
  <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
    <h2 className="text-xl font-semibold mb-2">How to Use the GPA Calculator</h2>
    <ul className="list-disc pl-6 mb-2 text-sm">
      <li>Each semester is shown as a separate section. You can add more semesters using the <b>Add Semester</b> button.</li>
      <li>For each semester, add your courses using the <b>Add Course</b> button.</li>
      <li>Enter the course name, select your grade, credits, and course weight (Regular, Honors, AP/IB, College).</li>
      <li>Use the <b>Weighted</b> toggle for each semester if you want to include extra weight for Honors/AP/IB/College courses.</li>
      <li>The calculator will display your GPA for each semester and your cumulative GPA at the bottom.</li>
    </ul>
    <h3 className="text-lg font-semibold mb-1">How GPA is Calculated</h3>
    <p className="text-sm">
      GPA (Grade Point Average) is calculated by assigning each grade a point value (A=4.0, A-=3.7, etc.), adding any weight (Honors/AP/IB/College) if weighted is ON, multiplying by the course credits, summing these values, and dividing by the total number of credits.
    </p>
  </div>
);

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'default', size = 'default', className = '' }) => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3',
    icon: 'h-8 w-8 p-0',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

function getGradePoint(grade: string) {
  const found = gradeOptions.find(opt => opt.label === grade);
  return found ? found.value : 0;
}

function getWeightValue(weight: string) {
  const found = weightOptions.find(opt => opt.label === weight);
  return found ? found.value : 0;
}

function calculateSemesterGPA(courses: Course[], weighted: boolean) {
  let totalPoints = 0;
  let totalCredits = 0;
  courses.forEach(course => {
    const credits = parseFloat(course.credits);
    const gradePoint = getGradePoint(course.grade);
    const weight = getWeightValue(course.weight);
    if (!isNaN(credits) && credits > 0 && course.grade && course.weight) {
      totalPoints += (gradePoint + (weighted ? weight : 0)) * credits;
      totalCredits += credits;
    }
  });
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

function calculateCumulativeGPA(semesters: Semester[]) {
  let totalPoints = 0;
  let totalCredits = 0;
  semesters.forEach(semester => {
    semester.courses.forEach(course => {
      const credits = parseFloat(course.credits);
      const gradePoint = getGradePoint(course.grade);
      const weight = getWeightValue(course.weight);
      if (!isNaN(credits) && credits > 0 && course.grade && course.weight) {
        totalPoints += (gradePoint + (semester.weighted ? weight : 0)) * credits;
        totalCredits += credits;
      }
    });
  });
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

const GPACalculator: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: 1,
      weighted: false,
      courses: [
        { id: 1, name: '', grade: '', credits: '', weight: '' },
        { id: 2, name: '', grade: '', credits: '', weight: '' },
      ],
    },
  ]);

  const handleCourseChange = (semesterIndex: number, courseIndex: number, field: string, value: string) => {
    const newSemesters = semesters.map((semester, sIdx) => {
      if (sIdx !== semesterIndex) return semester;
      return {
        ...semester,
        courses: semester.courses.map((course, cIdx) =>
          cIdx === courseIndex ? { ...course, [field]: value } : course
        ),
      };
    });
    setSemesters(newSemesters);
  };

  const handleAddCourse = (semesterIndex: number) => {
    const newSemesters = semesters.map((semester, idx) => {
      if (idx !== semesterIndex) return semester;
      return {
        ...semester,
        courses: [
          ...semester.courses,
          { id: Date.now(), name: '', grade: '', credits: '', weight: '' },
        ],
      };
    });
    setSemesters(newSemesters);
  };

  const handleAddSemester = () => {
    const newSemester: Semester = {
      id: Date.now(),
      weighted: false,
      courses: [
        { id: 1, name: '', grade: '', credits: '', weight: '' },
        { id: 2, name: '', grade: '', credits: '', weight: '' },
      ],
    };
    setSemesters([...semesters, newSemester]);
  };

  const handleRemoveCourse = (semesterIndex: number, courseIndex: number) => {
    const newSemesters = semesters.map((semester, idx) => {
      if (idx !== semesterIndex) return semester;
      return {
        ...semester,
        courses: semester.courses.filter((_, i) => i !== courseIndex),
      };
    });
    setSemesters(newSemesters);
  };

  const handleSemesterWeightedToggle = (semesterIndex: number) => {
    const newSemesters = semesters.map((semester, idx) => {
      if (idx !== semesterIndex) return semester;
      return { ...semester, weighted: !semester.weighted };
    });
    setSemesters(newSemesters);
  };

  const handleRemoveSemester = (semesterIndex: number) => {
    setSemesters(semesters.filter((_, idx) => idx !== semesterIndex));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/education" className="hover:text-blue-600 transition-colors">Education Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">GPA Calculator</span>
      </nav>
      <HowToSection />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">GPA Calculator</h1>
      </div>

      {semesters.map((semester, sIndex) => (
        <div key={semester.id} className="mb-6 border rounded-lg shadow bg-white">
          <div className="space-y-4 p-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Semester {sIndex + 1}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Weighted</span>
                  <input
                    type="checkbox"
                    checked={semester.weighted}
                    onChange={() => handleSemesterWeightedToggle(sIndex)}
                    className="w-5 h-5"
                  />
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveSemester(sIndex)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {semester.courses.map((course, cIndex) => (
              <div key={course.id} className="grid grid-cols-6 gap-4 items-center">
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Course Name"
                  value={course.name}
                  onChange={e => handleCourseChange(sIndex, cIndex, 'name', e.target.value)}
                />

                <select
                  className="border rounded px-2 py-1"
                  value={course.grade}
                  onChange={e => handleCourseChange(sIndex, cIndex, 'grade', e.target.value)}
                >
                  <option value="">Grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade.label} value={grade.label}>{grade.label}</option>
                  ))}
                </select>

                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={e => handleCourseChange(sIndex, cIndex, 'credits', e.target.value)}
                  min="0"
                />

                <select
                  className="border rounded px-2 py-1"
                  value={course.weight}
                  onChange={e => handleCourseChange(sIndex, cIndex, 'weight', e.target.value)}
                >
                  <option value="">Weight</option>
                  {weightOptions.map((w) => (
                    <option key={w.label} value={w.label}>{w.label}</option>
                  ))}
                </select>

                <input
                  className="border rounded px-2 py-1"
                  placeholder="GPA"
                  disabled
                  value={
                    course.grade && course.credits && course.weight
                      ? (
                        (getGradePoint(course.grade) + (semester.weighted ? getWeightValue(course.weight) : 0)) *
                        (parseFloat(course.credits) || 0)
                      ).toFixed(2)
                      : "0.00"
                  }
                />

                <Button variant="ghost" size="icon" onClick={() => handleRemoveCourse(sIndex, cIndex)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm font-medium">
                Semester GPA: {calculateSemesterGPA(semester.courses, semester.weighted)}
              </p>
              <Button size="sm" variant="outline" onClick={() => handleAddCourse(sIndex)}>
                <Plus className="mr-1 h-4 w-4" /> Add Course
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6">
        <Button onClick={handleAddSemester}>
          <Plus className="mr-1 h-4 w-4" /> Add Semester
        </Button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Cumulative GPA</p>
          <p className="text-3xl font-bold">{calculateCumulativeGPA(semesters)}</p>
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;