// pages/jobs.js
import React from "react";
import Jobs from "../components/Jobs";
import fetch from "node-fetch";

export default function JobsPage({ degree, jobs, filters }) {
  return <Jobs degree={degree} jobs={jobs} filters={filters} />;
}

export async function getServerSideProps({ query }) {
  const {
    degree     = "",
    location   = "",
    job_type    = "",
    salary_min  = "",
    salary_max  = "",
    posted_days = "",
  } = query;

  const appId  = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  //50-entry synonyms map
  const synonymsMap = {
    "computer science": ["Software Engineer","Data Scientist","AI Engineer","Systems Analyst","Frontend Developer","Backend Developer"],
    "information technology": ["IT Support Specialist","Network Administrator","Systems Administrator","IT Consultant","Help Desk Technician"],
    "software engineering": ["Software Engineer","Full Stack Developer","Backend Developer","Frontend Developer"],
    "data science": ["Data Scientist","Data Analyst","Machine Learning Engineer","Business Intelligence Analyst","Statistical Analyst"],
    "electrical engineering": ["Electrical Engineer","Electronics Engineer","Control Systems Engineer","Power Systems Engineer","Embedded Systems Engineer"],
    "mechanical engineering": ["Mechanical Engineer","Design Engineer","Manufacturing Engineer","Project Engineer","Maintenance Engineer"],
    "civil engineering": ["Civil Engineer","Structural Engineer","Transportation Engineer","Geotechnical Engineer","Site Engineer"],
    "chemical engineering": ["Chemical Engineer","Process Engineer","Plant Engineer","Materials Engineer","Safety Engineer"],
    "biomedical engineering": ["Biomedical Engineer","Clinical Engineer","Medical Device Engineer","Rehabilitation Engineer","Bioinstrumentation Engineer"],
    "business administration": ["Business Analyst","Operations Manager","Project Manager","Business Development Manager","Management Consultant"],
    finance: ["Financial Analyst","Investment Analyst","Accountant","Auditor","Risk Analyst"],
    marketing: ["Marketing Manager","Digital Marketing Specialist","Brand Manager","Content Strategist","SEO Specialist"],
    accounting: ["Accountant","Financial Accountant","Management Accountant","Tax Accountant","Auditor"],
    psychology: ["Psychologist","Counselor","HR Specialist","Research Assistant","Behavioral Scientist"],
    sociology: ["Social Researcher","Policy Analyst","Community Development Worker","Social Worker","Research Analyst"],
    economics: ["Economist","Economic Analyst","Policy Analyst","Financial Analyst","Research Assistant"],
    biology: ["Biologist","Laboratory Technician","Research Scientist","Environmental Scientist","Biotech Researcher"],
    biotechnology: ["Biotech Researcher","Biomedical Scientist","Quality Control Analyst","Clinical Research Associate","Regulatory Affairs Specialist"],
    chemistry: ["Chemist","Laboratory Technician","Analytical Chemist","Quality Control Chemist","Research Scientist"],
    physics: ["Physicist","Research Scientist","Data Analyst","Medical Physicist","Systems Engineer"],
    mathematics: ["Mathematician","Data Analyst","Actuarial Analyst","Quantitative Analyst","Operations Research Analyst"],
    statistics: ["Statistician","Data Analyst","Actuarial Analyst","Biostatistician","Quantitative Analyst"],
    education: ["Teacher","Education Consultant","Curriculum Developer","Academic Advisor","Education Administrator"],
    "english literature": ["Editor","Content Writer","Copywriter","Proofreader","Teaching Assistant"],
    history: ["Historian","Researcher","Archivist","Museum Curator","Educator"],
    "political science": ["Policy Analyst","Political Consultant","Public Affairs Specialist","Legislative Assistant","Lobbyist"],
    "international relations": ["Diplomatic Officer","Foreign Service Officer","International Development Consultant","NGO Coordinator","Policy Analyst"],
    communications: ["Communications Specialist","Public Relations Specialist","Corporate Communications Manager","Media Relations Specialist","Content Strategist"],
    journalism: ["Journalist","Reporter","News Editor","Copy Editor","Broadcast Journalist"],
    "graphic design": ["Graphic Designer","UI Designer","UX Designer","Art Director","Visual Designer"],
    architecture: ["Architect","Urban Planner","Interior Designer","Landscape Architect","Project Architect"],
    "environmental science": ["Environmental Scientist","Environmental Consultant","Sustainability Analyst","Ecologist","Water Resource Specialist"],
    nursing: ["Registered Nurse","Clinical Nurse Specialist","Nurse Practitioner","Nurse Educator","Home Health Nurse"],
    "public health": ["Public Health Analyst","Health Promotion Specialist","Epidemiologist","Community Health Worker","Health Policy Analyst"],
    pharmacy: ["Pharmacist","Pharmacy Technician","Clinical Pharmacist","Regulatory Affairs Specialist","Formulation Scientist"],
    medicine: ["Doctor","General Practitioner","Medical Researcher","Surgeon","Hospital Administrator"],
    dentistry: ["Dentist","Orthodontist","Dental Hygienist","Oral Surgeon","Dental Researcher"],
    "veterinary medicine": ["Veterinarian","Veterinary Nurse","Animal Health Technician","Veterinary Researcher","Practice Manager"],
    law: ["Lawyer","Paralegal","Legal Advisor","Compliance Officer","Legal Researcher"],
    anthropology: ["Anthropologist","Cultural Resource Manager","Museum Curator","Policy Analyst","Research Analyst"],
    "art history": ["Museum Curator","Art Historian","Archivist","Gallery Manager","Cultural Heritage Specialist"],
    music: ["Music Teacher","Sound Engineer","Music Therapist","Composer","Music Producer"],
    theatre: ["Actor","Theatre Director","Stage Manager","Dramaturge","Drama Teacher"],
    "film studies": ["Film Critic","Film Producer","Screenwriter","Video Editor","Cinematographer"],
    "computer engineering": ["Computer Hardware Engineer","Embedded Systems Engineer","Network Engineer","Systems Engineer","FPGA Engineer"],
    "information systems": ["Systems Analyst","Business Systems Analyst","IT Project Manager","Database Administrator","ERP Consultant"],
    cybersecurity: ["Security Analyst","Cybersecurity Engineer","Penetration Tester","Information Security Manager","Security Consultant"],
    "artificial intelligence": ["AI Engineer","Machine Learning Engineer","Data Scientist","Research Scientist","AI Consultant"],
    robotics: ["Robotics Engineer","Automation Engineer","Controls Engineer","Mechatronics Engineer","Research Engineer"],
    "environmental engineering": ["Environmental Engineer","Water Resource Engineer","Air Quality Engineer","Waste Management Engineer","Sustainability Engineer"],
    geology: ["Geologist","Geospatial Analyst","Petroleum Engineer","Mining Engineer","Environmental Consultant"],
    "hospitality management": ["Hotel Manager","Event Coordinator","Restaurant Manager","Hospitality Consultant","Front Desk Manager"],
    "supply chain management": ["Supply Chain Analyst","Logistics Manager","Operations Manager","Procurement Specialist","Inventory Manager"],
    "human resources": ["HR Specialist","Recruitment Consultant","Training and Development Specialist","HR Manager","Compensation Analyst"]
  };

  // determine which search terms to use
  const norm = degree.trim().toLowerCase();
  let terms = [degree.trim()];
  for (const key of Object.keys(synonymsMap)) {
    if (norm.includes(key)) {
      terms = synonymsMap[key];
      break;
    }
  }

  //fetch up to 50 unique jobs
  const seen = new Set();
  const results = [];
  for (const term of terms) {
    if (results.length >= 50) break;
    let url =
      `https://api.adzuna.com/v1/api/jobs/gb/search/1` +
      `?app_id=${appId}&app_key=${appKey}` +
      `&results_per_page=20` +
      `&what=${encodeURIComponent(term)}` +
      `&where=${encodeURIComponent(location)}`;
    if (job_type)   url += `&full_time=${job_type === "Full-time" ? 1 : 0}`;
    if (salary_min) url += `&salary_min=${salary_min}`;
    if (salary_max) url += `&salary_max=${salary_max}`;
    if (posted_days)url += `&max_days_old=${posted_days}`;

    try {
      const res  = await fetch(url);
      const data = await res.json();
      for (const j of data.results || []) {
        if (!seen.has(j.id)) {
          seen.add(j.id);
          results.push(j);
          if (results.length >= 50) break;
        }
      }
    } catch (err) {
      console.error("Adzuna fetch error:", err);
    }
  }

  const filters = { location, job_type, salary_min, salary_max, posted_days };
  return { props: { degree, jobs: results, filters } };
}
