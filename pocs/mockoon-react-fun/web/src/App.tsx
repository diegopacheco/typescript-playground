import { useState, type ComponentType } from 'react';
import { RequestLog } from './components/RequestLog.tsx';
import { BlogTab } from './tabs/BlogTab.tsx';
import { BooksTab } from './tabs/BooksTab.tsx';
import { CalculatorTab } from './tabs/CalculatorTab.tsx';
import { GalleryTab } from './tabs/GalleryTab.tsx';
import { GameTab } from './tabs/GameTab.tsx';
import { NotesTab } from './tabs/NotesTab.tsx';

type Channel = {
  id: string;
  name: string;
  route: string;
  title: string;
  lede: string;
  meta: string[];
  View: ComponentType;
};

const CHANNELS: readonly Channel[] = [
  {
    id: 'books',
    name: 'Books',
    route: '/books',
    title: 'Book catalogue',
    lede: 'Create, search, sort, edit and delete. Click any row to load it into the editor. Search, sort and paging are answered by Mockoon, not by the browser.',
    meta: ['CRUD route', 'data bucket · books', 'search + sort server side'],
    View: BooksTab
  },
  {
    id: 'calculator',
    name: 'Calculator',
    route: '/calculations',
    title: 'Calculator',
    lede: 'The browser never does the arithmetic. It POSTs the operands, a Mockoon template evaluates them and appends the result to a stateful history bucket.',
    meta: ['templated route', 'server side arithmetic', 'divide by zero → 400'],
    View: CalculatorTab
  },
  {
    id: 'gallery',
    name: 'Gallery',
    route: '/images',
    title: 'Image gallery',
    lede: 'Add pictures from a URL, or drop them from your machine. Dropped files are downscaled in the browser and stored as data URLs, because a mock has no disk.',
    meta: ['CRUD route', 'data bucket · images', 'drag and drop'],
    View: GalleryTab
  },
  {
    id: 'notes',
    name: 'Notes',
    route: '/notes',
    title: 'Notes',
    lede: 'Title, free text and a Notion-style checklist per note. Ticking a box on a saved note sends a PATCH, which Mockoon merges into the stored record.',
    meta: ['CRUD route', 'PUT and PATCH', 'nested todo array'],
    View: NotesTab
  },
  {
    id: 'game',
    name: 'Rock Paper Scissors',
    route: '/rounds',
    title: 'Rock, paper, scissors',
    lede: 'Pick a move and the mock picks its own, decides who won and records the round. The result never comes from this page.',
    meta: ['templated route', 'server side randomness', 'stateful round history'],
    View: GameTab
  },
  {
    id: 'blog',
    name: 'Mini blog',
    route: '/posts',
    title: 'Mini blog',
    lede: 'Write, edit and delete posts with tags, a cover picture and an embedded YouTube video. Newest first, ordered by the mock.',
    meta: ['CRUD route', 'data bucket · posts', 'video + picture embeds'],
    View: BlogTab
  }
];

export const App = () => {
  const [activeId, setActiveId] = useState<string>(CHANNELS[0]!.id);
  const active = CHANNELS.find((channel) => channel.id === activeId) ?? CHANNELS[0]!;
  const { View } = active;

  return (
    <div className="shell">
      <nav className="rail" aria-label="Sections">
        <div className="brand">
          <div className="brand__mark">
            mockoon<span>·</span>react
          </div>
          <div className="brand__sub">no backend was harmed</div>
        </div>

        <div className="channels" role="tablist">
          {CHANNELS.map((channel, index) => (
            <button
              key={channel.id}
              role="tab"
              aria-selected={channel.id === activeId}
              className={channel.id === activeId ? 'channel channel--live' : 'channel'}
              onClick={() => setActiveId(channel.id)}
            >
              <span className="channel__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="channel__name">{channel.name}</span>
              <span className="channel__route">{channel.route}</span>
            </button>
          ))}
        </div>

        <div className="rail__foot">
          <div>
            <b>react</b> 19 · <b>vite</b> 8
          </div>
          <div>
            <b>bun</b> runtime · <b>ts</b> 7
          </div>
          <div>
            <b>mockoon</b> 9 · stateful
          </div>
        </div>
      </nav>

      <main className="stage" role="tabpanel" aria-label={active.title}>
        <header className="masthead">
          <div>
            <h1 className="masthead__title">{active.title}</h1>
            <p className="masthead__lede">{active.lede}</p>
          </div>
          <div className="masthead__meta">
            {active.meta.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </header>
        <View key={active.id} />
      </main>

      <RequestLog />
    </div>
  );
};
