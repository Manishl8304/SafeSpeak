import React from "react";
import "./HelpCenter.css"; // Import your CSS for styling
import { Navbar } from "@/components/Navbar/Navbar";

const HelpCenter = () => {
  return (
    <>
      <Navbar />
      <div className="help-center-container">
        <h1 className="page-title">Help Center</h1>

        {/* Emergency Contacts Section */}
        <section className="section">
          <h2 className="section-title">Emergency Contacts</h2>
          <div className="cards-container">
            {[
              { title: "Ambulance", number: "102" },
              { title: "Police", number: "100" },
              { title: "Fire Brigade", number: "101" },
              { title: "Women’s Helpline", number: "1091" },
              { title: "Child Helpline", number: "1098" },
              { title: "Disaster Management", number: "108" },
              { title: "COVID-19 Helpline", number: "1075" },
              { title: "Senior Citizens Helpline", number: "14567" },
            ].map((contact, index) => (
              <div className="card" key={index}>
                <h3>{contact.title}</h3>
                <p>
                  <a href={`tel:${contact.number}`}>{contact.number}</a>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Health Tips Section */}
        <section className="section">
          <h2 className="section-title">Health Tips</h2>
          <div className="cards-container">
            {[
              {
                title: "Physical Health",
                tips: [
                  "Exercise for at least 30 minutes daily.",
                  "Maintain a balanced diet with fruits, vegetables, and proteins.",
                  "Stay hydrated and avoid smoking or excessive alcohol.",
                ],
              },
              {
                title: "Mental Health",
                tips: [
                  "Practice mindfulness and meditation.",
                  "Stay connected with loved ones to combat loneliness.",
                  "Limit social media use and seek help when needed.",
                ],
              },
              {
                title: "Diet & Nutrition",
                tips: [
                  "Include whole grains, lean proteins, and healthy fats in your meals.",
                  "Eat seasonal fruits and vegetables to boost immunity.",
                  "Reduce salt, sugar, and saturated fat intake.",
                ],
              },
            ].map((category, index) => (
              <div className="card" key={index}>
                <h3>{category.title}</h3>
                <ul>
                  {category.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* First-Aid Guides Section */}
        <section className="section">
          <h2 className="section-title">First-Aid Guides</h2>
          <div className="cards-container">
            {[
              {
                title: "CPR (Cardiopulmonary Resuscitation)",
                steps: [
                  "Ensure the person is lying flat on their back.",
                  "Place your hands on the center of their chest.",
                  "Push hard and fast, at least 100-120 compressions per minute.",
                ],
              },
              {
                title: "Burns",
                steps: [
                  "Cool the burn with running tap water for 10-20 minutes.",
                  "Cover with a clean, non-stick dressing.",
                  "Avoid applying ice or creams to the affected area.",
                ],
              },
              {
                title: "Bleeding",
                steps: [
                  "Apply firm pressure with a clean cloth.",
                  "Keep the injured part elevated.",
                  "Seek medical help if bleeding persists.",
                ],
              },
            ].map((guide, index) => (
              <div className="card" key={index}>
                <h3>{guide.title}</h3>
                <ol>
                  {guide.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Resource Links Section */}
        <section className="section">
          <h2 className="section-title">Resource Links</h2>
          <div className="cards-container">
            {[
              {
                title: "Government Organizations",
                links: [
                  { text: "Ministry of Health and Family Welfare (MoHFW)", url: "https://www.mohfw.gov.in" },
                  { text: "National Health Portal", url: "https://www.nhp.gov.in" },
                  { text: "Ayushman Bharat", url: "https://pmjay.gov.in" },
                ],
              },
              {
                title: "Non-Governmental Organizations",
                links: [
                  { text: "Indian Red Cross Society", url: "https://indianredcross.org" },
                  { text: "Goonj", url: "https://goonj.org" },
                  { text: "Save the Children India", url: "https://www.savethechildren.in" },
                ],
              },
              {
                title: "Mental Health Hotlines",
                links: [
                  { text: "NIMHANS Helpline", url: "tel:08046110007" },
                  { text: "AASRA (Suicide Prevention)", url: "tel:919820466726" },
                ],
              },
            ].map((category, index) => (
              <div className="card" key={index}>
                <h3>{category.title}</h3>
                <ul>
                  {category.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HelpCenter;
