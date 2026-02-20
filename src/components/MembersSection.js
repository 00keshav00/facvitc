'use client';

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaLinkedin, FaYoutube, FaLink } from 'react-icons/fa';

const MemberCard = ({ img, name, role, quote, instagram, linkedin, youtube, other, revealDelay }) => {
  return (
    <div className={`test-card w-[calc(50%-8px)] sm:w-[300px] md:w-[320px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[10px] overflow-hidden transition-all duration-300 shadow-xl flex flex-col hover:-translate-y-1.5 hover:shadow-2xl reveal visible`} style={{transitionDelay: revealDelay}}>
      <div className="member-image w-full h-32 sm:h-[200px] overflow-hidden">
        <img src={img || '/placeholder_member.jpg'} alt={role} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="person flex flex-col gap-0.5 px-3 py-2.5 sm:px-[18px] sm:py-3.5 sm:pb-1.5">
        <div className="flex justify-between items-center w-full">
          <strong className="text-sm sm:text-base text-[#e6e6e6] truncate pr-2">
            {name}
          </strong>
          <div className="flex gap-2 shrink-0">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-[#bfc1c3] hover:text-pink-500 transition-colors">
                <FaInstagram size={14} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[#bfc1c3] hover:text-blue-500 transition-colors">
                <FaLinkedin size={14} />
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-[#bfc1c3] hover:text-red-500 transition-colors">
                <FaYoutube size={14} />
              </a>
            )}
            {other && (
              <a href={other} target="_blank" rel="noopener noreferrer" className="text-[#bfc1c3] hover:text-white transition-colors">
                <FaLink size={14} />
              </a>
            )}
          </div>
        </div>
        <span className="role text-[11px] sm:text-[13px] font-semibold text-[#bfc1c3] truncate">{role}</span>
      </div>
      {quote && (
        <div className="quote px-3 pb-3 sm:px-[18px] sm:pb-[18px] text-[#bfc1c3] text-[12px] sm:text-[14px] leading-relaxed line-clamp-2 sm:line-clamp-none">
          {quote}
        </div>
      )}
    </div>
  );
};

export default function MembersSection({ members = [] }) {
  const safeMembers = Array.isArray(members) ? members : [];
  const facultyMember = safeMembers.find(m => m.isFaculty);
  const leadMembers = safeMembers.filter(m => !m.isFaculty).sort((a, b) => a.order - b.order);

  // If no members passed, default to static list or empty
  const displayFaculty = facultyMember || { name: "Dr. Anjali Sharma", role: "Faculty Coordinator", quote: "Guiding the club with vision and academic excellence.", image: "/images/faculty.jpg" };
  const displayLeads = leadMembers.length > 0 ? leadMembers : [
    { name: "Prasenjit Choudhury", role: "President", quote: "Passionate about traditional and contemporary art forms.", image: "/president.jpg" }
  ];

  return (
    <section className="testimonials py-12 md:py-16 px-4 md:px-14 border-t border-[rgba(255,255,255,0.08)] flex flex-col items-center gap-8 md:gap-12 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.03)]" id="members">
      
      <div className="faculty-row flex justify-center w-full mb-4">
         <MemberCard 
           img={displayFaculty.image} 
           name={displayFaculty.name} 
           role={displayFaculty.role} 
           quote={displayFaculty.quote} 
           instagram={displayFaculty.instagram}
           linkedin={displayFaculty.linkedin}
           youtube={displayFaculty.youtube}
           other={displayFaculty.other}
         />
      </div>

      <div className="members-row flex justify-center gap-4 md:gap-6 flex-wrap w-full">
         {displayLeads.map((m, i) => (
           <MemberCard 
             key={i}
             img={m.image} 
             name={m.name} 
             role={m.role} 
             quote={m.quote || m.bio} 
             instagram={m.instagram}
             linkedin={m.linkedin}
             youtube={m.youtube}
             other={m.other}
           />
         ))}
      </div>

      <div className="members-cta flex justify-center my-8">
        <Link href="/members" className="members-btn px-6 py-2.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-[#e6e6e6] font-semibold transition-all duration-300 shadow-xl hover:bg-[rgba(255,255,255,0.08)] hover:-translate-y-0.5">
          View All FAC Members
        </Link>
      </div>

    </section>
  );
}
