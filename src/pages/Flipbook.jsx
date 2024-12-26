import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import '../index.css';
import { Document, Page, pdfjs } from "react-pdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faPause } from '@fortawesome/free-solid-svg-icons';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { franc } from 'franc-min';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Flipbook({ filePath }) {
  const [numPages, setNumPages] = useState(null);
  const [textContents, setTextContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [utterance, setUtterance] = useState(null);
  const [spokenText, setSpokenText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState('hi-IN');
  const [isTextLayerActive, setIsTextLayerActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cachedPages, setCachedPages] = useState({});

  const flipBookRef = useRef(null);

  useEffect(() => {
    if (filePath) {
      extractTextFromPDF(filePath);
    } else {
      console.error("Invalid file path provided.");
    }
  }, [filePath]);

  useEffect(() => {
    return () => {
      if (utterance && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [utterance]);

  function detectLanguage(text) {
    const langCode = franc(text);
    switch (langCode) {
      case 'hin':
        return 'hi-IN';
      case 'eng':
        return 'en-US';
      default:
        return 'en-US';
    }
  }

  // Optimized extract text function
  function extractTextFromPDF(file) {
    const loadingTask = pdfjs.getDocument(file);
    loadingTask.promise
      .then((pdf) => {
        const numPages = pdf.numPages;
        setNumPages(numPages);
        const textPromises = [];

        // Preload the first few pages and start loading ahead
        for (let i = 1; i <= numPages; i++) {
          textPromises.push(
            pdf.getPage(i).then((page) =>
              page.getTextContent().then((textContent) => {
                const text = textContent.items.map((item) => item.str).join(" ");
                return { pageNumber: i, text };
              })
            )
          );
        }

        // Load pages in parallel and cache them
        Promise.all(textPromises)
          .then((texts) => {
            setTextContents(texts);
            setLoading(false);
            if (texts.length > 0) {
              const detectedLanguage = detectLanguage(texts[0].text);
              setLanguage(detectedLanguage);
            }
          })
          .catch((error) => {
            console.error("Error extracting text from PDF:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error loading PDF:", error);
        setLoading(false);
      });
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  async function handleStartSpeech(text) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.lang = language;

    newUtterance.onstart = () => {
      setSpokenText("");
      setIsSpeaking(true);
      setIsTextLayerActive(true);
      setIsPaused(false);
    };

    newUtterance.onboundary = (event) => {
      if (event.name === "word") {
        setSpokenText(event.utterance.text.substring(event.charIndex, event.charIndex + event.charLength));
      }
    };

    newUtterance.onend = () => {
      setSpokenText("");
      setIsSpeaking(false);
      setIsTextLayerActive(false);
    };

    try {
      window.speechSynthesis.speak(newUtterance);
    } catch (error) {
      console.error("Speech synthesis error:", error);
    }
    setUtterance(newUtterance);
  }

  function handlePauseSpeech() {
    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }

  function handleResumeSpeech() {
    if (window.speechSynthesis.paused && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else if (!isSpeaking) {
      handleStartSpeech(textContents[currentPage - 1].text);
    }
  }

  function handleStopSpeech() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setUtterance(null);
    setSpokenText("");
    setIsSpeaking(false);
    setIsTextLayerActive(false);
    setIsPaused(false);
  }

  function handlePageClick(pageNumber) {
    if (!isTextLayerActive) {
      flipBookRef.current.pageFlip().flip(pageNumber - currentPage);
    }
    setCurrentPage(pageNumber);

    // Preload next page text if not cached
    if (!cachedPages[pageNumber + 1] && pageNumber < numPages) {
      const nextPageText = textContents.find(item => item.pageNumber === pageNumber + 1)?.text;
      if (nextPageText) {
        setCachedPages(prev => ({ ...prev, [pageNumber + 1]: nextPageText }));
      }
    }
  }

  function handleLanguageChange(event) {
    setLanguage(event.target.value);
  }

  function pagesList() {
    return textContents.map((page) => (
      <div key={page.pageNumber} style={{ position: 'relative' }}>
        <Page
          height={550}
          pageNumber={page.pageNumber}
          renderTextLayer={false}
          renderInteractiveForms={false}
          onClick={() => handlePageClick(page.pageNumber)}
        />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: '10px'
        }}>
          {!isSpeaking && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartSpeech(page.text);
              }}
              disabled={!page.text}
              style={{
                backgroundColor: page.text ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: page.text ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
                
              }}
              
            >
              <FontAwesomeIcon icon={faPlay} style={{ marginRight: '8px' }} />
              Start Reading
            </button>
          )}
          {isSpeaking && !isPaused && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePauseSpeech();
              }}
              style={{
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
              }}
            >
              <FontAwesomeIcon icon={faPause} style={{ marginRight: '8px' }} />
              Pause Reading
            </button>
          )}
          {isSpeaking && isPaused && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResumeSpeech();
              }}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
              }}
            >
              <FontAwesomeIcon icon={faPlay} style={{ marginRight: '8px' }} />
              Resume Reading
            </button>
          )}
          {isSpeaking && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStopSpeech();
              }}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
              }}
            >
              <FontAwesomeIcon icon={faStop} style={{ marginRight: '8px' }} />
              Stop Reading
            </button>
          )}
        </div>
      </div>
    ));
  }

  return (
    <div style={{
      position: 'relative',
      backgroundImage: `url('https://img.freepik.com/premium-photo/abstract-blurred-empty-college-library-interior-space-blurry-classroom-with-bookshelves-by-defocused-effect-generative-ai_438099-11738.jpg?w=740')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
    }}>
      {loading && (
        <div className="spinner"></div>
      )}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '5px',
        borderRadius: '5px',
        zIndex: 10,
        pointerEvents: 'none',
        fontSize: '18px',
        whiteSpace: 'nowrap',
      }}>
        {spokenText}
      </div>
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '5px',
        borderRadius: '5px',
        zIndex: 10,
      }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>Select Language:</label>
        <select id="language-select" value={language} onChange={handleLanguageChange}>
          <option value="hi-IN">Hindi</option>
          <option value="en-US">English</option>
        </select>
      </div>
      <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess} className="modal-90w">
        <HTMLFlipBook width={600} height={550} ref={flipBookRef}>
          {pagesList()}
        </HTMLFlipBook>
      </Document>
    </div>
  );
}

export default Flipbook;
