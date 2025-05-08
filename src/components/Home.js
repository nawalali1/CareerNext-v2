// src/components/Home.js
import React from "react";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import { FaRegFileAlt } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-background">
      <div className="home-overlay" />

      <div className="home-centered-card">
        <div className="home-card">
          <h1 className="home-heading">Find Your Path Forward</h1>
          <p className="home-subtext">
            Are you a student, graduate or a professional seeking clarity in the job market?
          </p>

          <div className="home-buttons">
            <button onClick={() => router.push("/degree")}>
              What can I do with my degree
            </button>
            <button onClick={() => router.push("/questionnaire")}>
              Changing careers or Job Seeking: Take Quiz 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
