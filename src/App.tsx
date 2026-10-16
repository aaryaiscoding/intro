import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  ChevronRight,
  Compass,
  Eye,
  FileText,
  FolderOpen,
  Power,
  Sparkles,
  Terminal as TerminalIcon,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

type PageFile = {
  id: string;
  title: string;
  kicker: string;
  color: string;
  icon: LucideIcon;
  paragraphs: string[];
  link?: { label: string; href: string };
};
type WindowItem = { id: string; kind: 'file' | 'terminal'; fileId?: string; minimized: boolean; z: number };
type TerminalEntry = { text: string; kind: 'system' | 'error' | 'promptline' };

const files: PageFile[] = [
  {
    id: 'who-i-am',
    title: 'who i am',
    kicker: 'a small introduction',
    color: '',
    icon: UserRound,
    paragraphs: [
      'I\’m Aarya, a final-year computer science student who loves old technology and making things that bring me joy. That\’s why this site looks like it runs on a computer from the 2000s.',
      'I tend to remember things I find interesting. Handy for exams and quizzing friends; less so when I hyperfixate on the production of a song nobody\'s heard of.',
      'I do the Wordle every single day and I love doing puzzles that make my brain turn into mush',
      'I LOVE SPACE. Open curiosity.exe for some (hopefully not brain-mush-inducing) hints that lead to more information about me!'
    ],
  },
  {
    id: 'who-i-want-to-be',
    title: 'who i want to be',
    kicker: 'future draft / in progress',
    color: 'coral',
    icon: Sparkles,
    paragraphs: [
      'Someone who keeps making things: software, mostly, but also letters, ideas, and the occasional experiment.',
      'I want to get better at building software, solving problems, and making things work the way they should.',
      'And I’d like to stay the kind of person who says yes to a new course, a new tool, or a slightly strange idea.',
    ],
  },
  {
    id: 'how-i-see-myself',
    title: 'how i see myself',
    kicker: 'notes from the inside',
    color: 'yellow',
    icon: Eye,
    paragraphs: [
      'I\'m a learner first. If something catches my interest, I need to know how it works. This applies to anything the people in my general vicinity have the misfortune of saying within earshot of me.',
      'I test ideas instead of just arguing about them: hypothesis, experiment, result. If it\'s good enough for a science textbook, it\'s  good enough for my problems.',
      'In a strange and undiscovered form of migration, all my best friends keep moving to the UK. I think it\'s because they know how much I like writing them letters.',
    ],
  },
  {
    id: 'where-im-headed',
    title: "where i'm headed",
    kicker: 'this is a small step for man, and an even smaller step for me (im short)',
    color: 'blue',
    icon: Compass,
    paragraphs: [
      'The GyanSys Office, hopefully.'
    ],
  },
  {
    id: 'portfolio',
    title: 'portfolio',
    kicker: 'the other site I made / opens in a new tab',
    color: 'green',
    icon: FolderOpen,
    paragraphs: [
      'The other site I made: a neon, hacker-style portfolio where I bring my projects together.',
      'It has a boot sequence, a glitching title, and an invert-display button. Old tech, but with neon flair.',
    ],
    link: {
      label: 'OPEN PORTFOLIO',
      href: 'https://aaryaiscoding.github.io/portfolio/',
    },
  },
];

const keywordFacts: { keys: string[]; text: string }[] = [
  {
    keys: ['space'],
    text: 'FACT: My favourite planet is Pluto. Even though it is technically a dwarf planet, it is planet enough for me.',
  },
  {
    keys: ['letters', 'letter'],
    text: 'FACT: I am India Post\'s biggest fan. I was terrified to learn that registered post was being discontinued and made the post office lady confirm thrice that regular post wasn\'t going anywhere.',
  },
  {
    keys: ['guitar'],
    text: 'FACT: I\'ve been learning to play a guitar for the past 4 years. It is a slow and painful process (especially for my poor fingers).',
  },
  {
    keys: ['science', 'method'],
    text: 'FACT: The scientific method was the best thing that ever happened to me. My current "experiment" is to find the best cup noodles, and I take my research very seriously.',
  },
  {
    keys: ['writing', 'write'],
    text: 'FACT: I love writing. You may have noticed.',
  },
  {
    keys: ['fact'],
    text: 'That\'s a little lazy of you, honestly. But here\'s a fact anyway: Giraffes sleep standing up.',
  }
];

function WinLogo() {
  return (
    <div className="win-logo" aria-hidden="true">
      <svg viewBox="0 0 120 100" className="win-logo-flag">
        <g fill="#000" transform="translate(5 5)">
          <path d="M10 14 Q28 4 46 14 V46 Q28 36 10 46 Z" />
          <path d="M52 16 Q70 26 88 16 V48 Q70 58 52 48 Z" />
          <path d="M10 52 Q28 42 46 52 V84 Q28 74 10 84 Z" />
          <path d="M52 54 Q70 64 88 54 V86 Q70 96 52 86 Z" />
        </g>
        <path d="M8 10 Q26 0 44 10 V42 Q26 32 8 42 Z" fill="#e8302a" />
        <path d="M50 12 Q68 22 86 12 V44 Q68 54 50 44 Z" fill="#2fb52f" />
        <path d="M8 48 Q26 38 44 48 V80 Q26 70 8 80 Z" fill="#1f4fd8" />
        <path d="M50 50 Q68 60 86 50 V82 Q68 92 50 82 Z" fill="#f4d820" />
      </svg>
      <div className="win-logo-text">
        <span className="win-logo-ms">
          Microsoft<sup>®</sup>
        </span>
        <span className="win-logo-win">
          Windows<sup>™</sup> <b>95</b>
        </span>
      </div>
    </div>
  );
}

const CLIPPY_GREETING =
  'It looks like you’re trying to explore a personal website. Would you like help? Too bad, I’m helping anyway. Click me for hints about curiosity.exe.';

const CLIPPY_HINTS: string[] = [
  'It looks like you’re typing random things into curiosity.exe. Start with “help”. Revolutionary, I know.',
  'Type “fact”. One word, one random fun fact. Even I could do it, and I’m a paperclip.',
  'Try “space”. It didn’t fit the 90s look, so it got exiled to the terminal. Relatable.',
  'Think of a popular music instrument. No not drums.',
  'Try “science” or “method”. Hypothesis: you’ll type it. Results pending.',
  'What is the alphabet made out of?',
  'Try “writing”. You’re reading my words right now. You’re welcome.',
  'Type “open who i am” to open files from the terminal. The mouse is for people with time.',
  'Closed Meet Me by accident? Type “meetme”. I saw you close it. I see everything.',
  'Type “clear” to wipe the screen, just like Microsoft wiped my existence.',
  'Every word that works is something she loves. Think hobbies. Think… less about me.',
  'Typed something and got an error? The terminal and I have agreed to blame each other.',
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function Clippy({
  terminalOpen,
  onOpenTerminal,
}: {
  terminalOpen: boolean;
  onOpenTerminal: () => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [wiggle, setWiggle] = useState(false);
  const deck = useRef<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMessage(CLIPPY_GREETING), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const nextHint = () => {
    if (!terminalOpen && Math.random() < 0.5) {
      setMessage(
        'You haven’t even opened curiosity.exe yet. It’s the black box with the >_ on the desktop. Go. Shoo.',
      );
      return;
    }
    if (deck.current.length === 0) deck.current = shuffle(CLIPPY_HINTS);
    setMessage(deck.current.pop() ?? CLIPPY_HINTS[0]);
  };

  const onClippyClick = () => {
    setWiggle(true);
    window.setTimeout(() => setWiggle(false), 600);
    nextHint();
  };

  return (
    <div className="clippy" onClick={(event) => event.stopPropagation()}>
      {message && (
        <div className="clippy-bubble" role="status" aria-live="polite">
          <button
            className="clippy-bubble-close"
            aria-label="Dismiss Clippy"
            onClick={() => setMessage(null)}
          >
            ×
          </button>
          <p>{message}</p>
          <div className="clippy-actions">
            {!terminalOpen && (
              <button onClick={onOpenTerminal}>Open curiosity.exe</button>
            )}
            <button onClick={nextHint}>Another hint</button>
          </div>
        </div>
      )}

      <button
        className={`clippy-figure ${wiggle ? 'wiggle' : ''}`}
        onClick={onClippyClick}
        aria-label="Clippy: click for a hint about curiosity.exe"
        title="Click me. I dare you."
      >
        <img
          src={`${import.meta.env.BASE_URL}clippy.png`}
          alt=""
          draggable={false}
        />
      </button>
    </div>
  );
}

function Home() {
  const [windows, setWindows] = useState<WindowItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [terminalLines, setTerminalLines] = useState<TerminalEntry[]>([
    { text: 'A little terminal for the things between the files.', kind: 'system' },
    { text: 'Type help to see what you can ask. Some words unlock a fun fact.', kind: 'system' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const zCounter = useRef(1);

  const [meetOpen, setMeetOpen] = useState(true);
  const [meetPos, setMeetPos] = useState<{ x: number; y: number } | null>(null);
  const meetRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [terminalLines, activeId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const startMeetDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    const el = meetRef.current;
    if (!el) return;
    dragRef.current = {
      px: event.clientX,
      py: event.clientY,
      ox: el.offsetLeft,
      oy: el.offsetTop,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveMeetDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const el = meetRef.current;
    if (!drag || !el) return;
    const parent = el.offsetParent as HTMLElement | null;
    const maxX = parent ? Math.max(0, parent.clientWidth - el.offsetWidth) : Infinity;
    const maxY = parent ? Math.max(0, parent.clientHeight - el.offsetHeight) : Infinity;
    setMeetPos({
      x: Math.min(maxX, Math.max(0, drag.ox + event.clientX - drag.px)),
      y: Math.min(maxY, Math.max(0, drag.oy + event.clientY - drag.py)),
    });
  };

  const endMeetDrag = () => {
    dragRef.current = null;
  };

  const openMeet = () => {
    setMeetOpen(true);
    setMenuOpen(false);
  };

  const focusWindow = (id: string) => {
    zCounter.current += 1;
    setWindows((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, minimized: false, z: zCounter.current }
          : item,
      ),
    );
    setActiveId(id);
  };

  const openFile = (fileId: string) => {
    const id = `file:${fileId}`;
    const existing = windows.find((item) => item.id === id);

    if (existing) {
      focusWindow(id);
    } else {
      zCounter.current += 1;
      setWindows((current) => [
        ...current,
        { id, kind: 'file', fileId, minimized: false, z: zCounter.current },
      ]);
      setActiveId(id);
    }

    setMenuOpen(false);
  };

  const openTerminal = () => {
    const id = 'terminal';
    const existing = windows.find((item) => item.id === id);

    if (existing) {
      focusWindow(id);
    } else {
      zCounter.current += 1;
      setWindows((current) => [
        ...current,
        { id, kind: 'terminal', minimized: false, z: zCounter.current },
      ]);
      setActiveId(id);
    }

    setMenuOpen(false);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  };

  const closeWindow = (id: string) => {
    setWindows((current) => {
      const next = current.filter((item) => item.id !== id);
      const visible = next
        .filter((item) => !item.minimized)
        .sort((a, b) => b.z - a.z);

      setActiveId((active) =>
        active === id ? visible[0]?.id ?? null : active,
      );
      return next;
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows((current) => {
      const next = current.map((item) =>
        item.id === id ? { ...item, minimized: true } : item,
      );
      const visible = next
        .filter((item) => !item.minimized)
        .sort((a, b) => b.z - a.z);

      setActiveId((active) =>
        active === id ? visible[0]?.id ?? null : active,
      );
      return next;
    });
  };

  const runCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const input = new FormData(form).get('command');
    const command = typeof input === 'string' ? input.trim() : '';

    if (!command) return;

    const normalized = command.toLowerCase();
    const next: TerminalEntry[] = [
      { text: `C:\\VISITOR> ${command}`, kind: 'promptline' },
    ];

    const keywordHit = keywordFacts.find((entry) =>
      entry.keys.includes(normalized),
    );

    if (normalized === 'help') {
      next.push({
        text: 'TRY: help · fact · open [file] · meetme · clear',
        kind: 'system',
      });
      next.push({
        text: 'Hint: type a word for something I love and see what happens.',
        kind: 'system',
      });
      next.push({
        text: 'File names: who i am / who i want to be / how i see myself / where i’m headed / portfolio',
        kind: 'system',
      });
    } else if (keywordHit) {
      next.push({ text: keywordHit.text, kind: 'system' });
    } else if (normalized === 'fact') {
      const random = keywordFacts[Math.floor(Math.random() * keywordFacts.length)];
      next.push({ text: random.text, kind: 'system' });
    } else if (normalized === 'whoami') {
      next.push({
        text: 'A user? I\'d expect you to know that.', 
        kind: 'system',
      });
    } else if (normalized === 'meetme' || normalized === 'meet me') {
      next.push({ text: 'Opening Meet Me…', kind: 'system' });
      window.setTimeout(openMeet, 140);
    } else if (normalized === 'open') {
      next.push({
        text: 'Tell me which file: open who i am',
        kind: 'system',
      });
    } else if (normalized.startsWith('open ')) {
      const target = normalized.slice(5).replaceAll(/[“”']/g, '').trim();
      const found = files.find(
        (file) =>
          file.id === target.replaceAll(' ', '-') ||
          file.title === target ||
          file.title.replaceAll("'", '') === target.replaceAll("'", ''),
      );

      if (found) {
        next.push({ text: `Opening ${found.title}…`, kind: 'system' });
        window.setTimeout(() => openFile(found.id), 140);
      } else {
        next.push({
          text: 'No file by that name. Type help for the exact file names.',
          kind: 'error',
        });
      }
    } else if (normalized === 'clear') {
      setTerminalLines([]);
      form.reset();
      return;
    } else {
      next.push({
        text: `“${command}” isn’t on the command list yet. Try help.`,
        kind: 'error',
      });
    }

    setTerminalLines((current) => [...current, ...next]);
    form.reset();
  };

  const formatWindowTitle = (item: WindowItem) =>
    item.kind === 'terminal'
      ? 'C:\\WINDOWS\\SYSTEM32\\COMMAND.COM'
      : `C:\\VISITOR\\${(
          files.find((file) => file.id === item.fileId)?.title ?? 'untitled'
        )
          .replaceAll("'", '')
          .replaceAll(' ', '_')
          .toUpperCase()}.TXT`;

  return (
    <main
      className="desktop"
      onClick={() => menuOpen && setMenuOpen(false)}
    >
      <div className="desktop-content">
        <WinLogo />

        {meetOpen && (
          <section
            className="desktop-intro"
            aria-label="Introduction"
            ref={meetRef}
            style={meetPos ? { left: meetPos.x, top: meetPos.y } : undefined}
          >
            <header
              className="window-titlebar"
              onPointerDown={startMeetDrag}
              onPointerMove={moveMeetDrag}
              onPointerUp={endMeetDrag}
              onPointerCancel={endMeetDrag}
            >
              <div className="window-title">
                <span className="window-title-mark">
                  <UserRound size={13} />
                </span>
                <span>Meet Me</span>
              </div>
              <div className="window-controls">
                <button
                  className="window-control"
                  aria-label="Close Meet Me"
                  title="Close"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMeetOpen(false);
                  }}
                >
                  ×
                </button>
              </div>
            </header>
            <div className="meetme-body">
              <h1>A little about the person at this computer.</h1>
              <p>
                This desktop belongs to Aarya. Feel free to look around, open a few files, and see what you find.
              </p>
            </div>
          </section>
        )}

        <nav className="desktop-icon-list" aria-label="Desktop files">
          {files.map((file) => (
            <button
              className="desktop-icon"
              key={file.id}
              onClick={(event) => {
                event.stopPropagation();
                openFile(file.id);
              }}
              aria-label={`Open ${file.title}`}
            >
              <span className={`icon-tile ${file.color}`} aria-hidden="true">
                <file.icon size={20} />
              </span>
              <span className="icon-name">{file.title}</span>
            </button>
          ))}

          <button
            className="desktop-icon terminal-shortcut"
            onClick={(event) => {
              event.stopPropagation();
              openTerminal();
            }}
            aria-label="Open the independent terminal"
          >
            <span className="terminal-glyph" aria-hidden="true">
              &gt;_
            </span>
            <span className="icon-name">curiosity.exe</span>
          </button>
        </nav>

        <p className="mobile-hint">
          Tap a file to open it. The command prompt has a few secrets.
        </p>
  

        {windows.map((item) => {
          if (item.minimized) return null;

          const isFile = item.kind === 'file';
          const file = files.find(
            (candidate) => candidate.id === item.fileId,
          );

          return (
            <section
              className={`window ${isFile ? 'file-window' : 'terminal-window'}`}
              key={item.id}
              style={{ zIndex: item.z }}
              onMouseDown={() => focusWindow(item.id)}
              aria-label={
                isFile ? file?.title : 'Independent command terminal'
              }
            >
              <header className="window-titlebar">
                <div className="window-title">
                  <span className="window-title-mark">
                    {isFile ? (
                      <FileText size={13} />
                    ) : (
                      <TerminalIcon size={13} />
                    )}
                  </span>
                  <span>{formatWindowTitle(item)}</span>
                </div>

                <div className="window-controls">
                  <button
                    className="window-control"
                    aria-label="Minimize window"
                    title="Minimize"
                    onClick={(event) => {
                      event.stopPropagation();
                      minimizeWindow(item.id);
                    }}
                  >
                    _
                  </button>
                  <button
                    className="window-control"
                    aria-label="Close window"
                    title="Close"
                    onClick={(event) => {
                      event.stopPropagation();
                      closeWindow(item.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </header>

              {isFile && file ? (
                <div className="file-body">
                  <div className="window-menu">
                    <span>File</span>
                    <span>Edit</span>
                    <span>Search</span>
                    <span>Help</span>
                  </div>

                  <div className="window-body">
                    <p className="document-kicker">{file.kicker}</p>
                    <h2 className="document-title">{file.title}</h2>
                    <div className="editable-copy">
                      {file.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {file.link && (
                      <a
                        className="file-link"
                        href={file.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.link.label}
                      </a>
                    )}
                    <div className="window-status">
                      <span>Line 01, Col 01</span>
                      <span>TEXT / UTF-8</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="terminal-body">
                  <div
                    className="terminal-scroll"
                    role="log"
                    aria-live="polite"
                  >
                    {terminalLines.map((line, index) => (
                      <p
                        className={`terminal-line ${line.kind}`}
                        key={`${index}-${line.text}`}
                      >
                        {line.text}
                      </p>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  <form className="terminal-form" onSubmit={runCommand}>
                    <label
                      className="terminal-prompt"
                      htmlFor="command-input"
                    >
                      C:\VISITOR&gt;
                    </label>
                    <input
                      ref={inputRef}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="terminal-input"
                      name="command"
                      id="command-input"
                      aria-label="Enter a terminal command"
                    />
                  </form>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {menuOpen && (
        <div
          className="start-menu"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="start-menu-head">
            AN INTRODUCTION TO
            <strong>the person at this PC</strong>
          </div>
          <button className="menu-action" onClick={openMeet}>
            <UserRound size={16} /> Meet Me
          </button>
          <button
            className="menu-action"
            onClick={() => openFile('who-i-am')}
          >
            <FileText size={16} /> About this person{' '}
            <ChevronRight size={13} style={{ marginLeft: 'auto' }} />
          </button>
          <button className="menu-action" onClick={openTerminal}>
            <TerminalIcon size={16} /> Open curiosity.exe
          </button>
          <div className="menu-rule" />
          <button
            className="menu-action"
            onClick={() => setMenuOpen(false)}
          >
            <Power size={16} /> Back to exploring
          </button>
        </div>
      )}

      <footer
        className="taskbar"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="start-button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="start-mark">m</span> start
        </button>
        <div className="task-divider" />

        {windows.map((item) => (
          <button
            key={item.id}
            className={`task-button ${
              item.minimized || activeId !== item.id ? 'minimized' : ''
            }`}
            title={item.minimized ? 'Restore window' : 'Minimize window'}
            onClick={() =>
              item.minimized || activeId !== item.id
                ? focusWindow(item.id)
                : minimizeWindow(item.id)
            }
          >
            {item.kind === 'terminal' ? (
              <TerminalIcon size={13} />
            ) : (
              <FileText size={13} />
            )}
            <span>
              {item.kind === 'terminal'
                ? 'curiosity.exe'
                : files.find((file) => file.id === item.fileId)?.title}
            </span>
          </button>
        ))}

        <div className="task-clock" aria-label="Current time">
          {clock.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </footer>

      <Clippy
        terminalOpen={windows.some((item) => item.id === 'terminal')}
        onOpenTerminal={openTerminal}
      />
    </main>
  );
}

function App() {
  return <Home />;
}

export default App;
