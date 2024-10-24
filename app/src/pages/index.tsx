import { useEffect, useState } from 'react';

interface Program {
  name: string;
  link: string;
  active: boolean;
}

interface ApiResponse {
  data: Program[];
}

export default function Home() {
  const [data, setData] = useState<Program[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/scrap');
        const result: ApiResponse = await response.json();
        setData(result.data);
      } catch (error: any) {
        console.error('Erro ao buscar os dados:', error.message);
      }
    }

    fetchData();
  }, []);

  function renderProgram() {
    if (data) {
      return data.map((d) => (
        <div
          key={d.name}
          className={`p-2 ${d.link ? 'bg-green-600' : 'bg-red-700'} max-w-96`}
        >
          <a href={d.link} target='_blank' rel='noopener noreferrer'>
            {d.name}
          </a>
        </div>
      ));
    }
    return null;
  }

  return (
    <div className='ml-2 mb-2'>
      <h1 className='mb-5'>Datas Scraped:</h1>
      <div className='flex flex-col gap-2'>
        {data ? renderProgram() : 'Carregando...'}
      </div>
    </div>
  );
}
