//
// Side-by-side comparison of the client-side vs server-side data fetching approaches for the same component.
//

// React Client Component (with useEffect/useState).
import React, { useEffect, useState } from "react";

function Home() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/albums",
        );
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {albums.map((album: { id: number; title: string }) => (
        <div
          key={album.id}
          className="bg-white shadow-md rounded-lg p-4 transition transform hover:scale-105 hover:shadow-lg"
        >
          <h3 className="text-lg font-bold mb-2">{album.title}</h3>
          <p className="text-gray-600">Album ID: {album.id}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;

// Next.js Server Component (with async/await).
async function Home() {
  const response = await fetch("https://jsonplaceholder.typicode.com/albums");
  if (!response.ok) throw new Error("Failed to fetch data");

  const albums = await response.json();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {albums.map((album: { id: number, title: string }) => (
        <div
          key={album.id}
          className="bg-white shadow-md rounded-lg p-4 transition f..."
        >
          <h3 className="text-lg font-bold mb-2">{album.title}</h3>
          <p className="text-gray-600">Album ID: {album.id}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;

////// TS //////
// Види поліморфізму
// 1. Поліморфізм підтипів (через наслідування)
class Animal {
  speak(): string {
    return "...";
  }
}

class Dog extends Animal {
  speak(): string {
    return "Гав!";
  }
}

class Cat extends Animal {
  speak(): string {
    return "Няв!";
  }
}

// Один і той самий виклик — різний результат
const animals: Animal[] = [new Dog(), new Cat()];
animals.forEach(a => console.log(a.speak()));
// Гав!
// Няв!

// 2. Поліморфізм через інтерфейси (частіше використовується в TS)
interface Shape {
  area(): number;
}

class Circle implements Shape {
  constructor(private radius: number) { }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle implements Shape {
  constructor(private w: number, private h: number) { }

  area(): number {
    return this.w * this.h;
  }
}

// Функція не знає який саме Shape — і не мусить знати
function printArea(shape: Shape): void {
  console.log(`Площа: ${shape.area().toFixed(2)}`);
}

printArea(new Circle(5));      // Площа: 78.54
printArea(new Rectangle(4, 6)); // Площа: 24.00

// 3. Перевантаження методів (overloading)
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}

add(1, 2);       // 3
add("Hi", "!"); // "Hi!"