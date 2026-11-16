/**
 * Synthetic resume that mirrors the macro structure used by the
 * real .tex resumes (\resumeSubheading, \resumeProject, \resumeItem
 * lists, \textbf skill rows). It contains NO personal data.
 */
export const SAMPLE_TEX = String.raw`
\documentclass[a4paper,10pt]{article}

\newcommand{\name}{Jane Example}
\newcommand{\course}{Computer Science}
\newcommand{\phone}{5550100}
\newcommand{\emaila}{jane@example.com}

% \href{https://github.com/commented-out}{commented}

\begin{document}

\begin{center}
    {{\faPhone~+1-\phone} |
    \href{mailto:\emaila}{\faEnvelope~\emaila} |
    \href{https://github.com/janeexample}{\faGithub~janeexample} |
    \href{https://www.linkedin.com/in/jane-example/}{\faLinkedin~linkedin.com/in/jane-example} |
    \href{https://jane.example.dev/}{Portfolio}}
\end{center}

%-----------EDUCATION-----------------
\section{\textbf{Education}}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Example University}{CGPA: 9.0}
      {BTech in Computer Science \& Engineering}{2022-Present}
      \vspace{-3.0mm}
    \resumeSubheading
      {Example High School}{Percentage: 90}
      {HSC Board}{2022}
  \resumeSubHeadingListEnd

%-----------EXPERIENCE-----------------
\section{\textbf{Professional Experience}}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Acme Corp}{Remote}
      {Frontend Intern}{June 2025 – September 2025}
      \resumeItemListStart
        \item {Built \textbf{pixel-perfect} UI from designs.}
        \item {Integrated APIs with Axios.}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\section{\textbf{Personal Projects}}
  \resumeSubHeadingListStart
    \resumeProject
    {\href{https://github.com/janeexample/alpha}{Alpha}}
    {A recommendation platform for testing.}
      \resumeItemListStart
        \item {Used \textbf{TF-IDF} with cosine similarity.}
        \item {Exposed a Flask REST API.}
      \resumeItemListEnd
    % \resumeProject
    % {\href{https://github.com/janeexample/hidden}{Hidden}}
    % {This project is commented out and must not be parsed.}
    \resumeProject
    {\href{https://github.com/janeexample/beta}{Beta}}
    {A chat application.}
      \resumeItemListStart
        \item {Realtime messaging with Socket.IO.}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

%-----------Technical skills-----------------
\section{\textbf{Technical Skills }}
 \begin{itemize}[leftmargin=0.05in, label={}]
    \small{\item{
     \textbf{Languages}{: Java, Python, C } \\
     \textbf{Frameworks}{: React.js, Flask} \\
    }}
 \end{itemize}

%-----------Certificates-----------------
\section{\textbf{Courses And Certificates}}
    \resumeItemListStart
        \item{\textbf{ExampleLearn}: Machine
Learning Specialization}
        % \item{\textbf{Hidden}: Commented certificate}
        \item{\textbf{Example Cloud} : Cloud Foundations}
    \resumeItemListEnd

\end{document}
`;
