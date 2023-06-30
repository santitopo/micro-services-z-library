export default function translate(word) {
  switch (word) {
    case 'Baby':
      return 'Bebé';
    case 'Young':
      return 'Joven';
    case 'Adult':
      return 'Adulto';
    case 'Old':
      return 'Viejo';
    case 'Male':
      return 'Macho';
    case 'Female':
      return 'Hembra';
    case 'Yes':
      return 'Sí';
    case 'Not Sure':
      return 'N/A';
    case 'Small':
      return 'Pequeño';
    case 'Medium':
      return 'Mediano';
    case 'Big':
      return 'Grande';
    case 'Short':
      return 'Corto';
    case 'Middle':
      return 'Mediano';
    case 'Large':
      return 'Largo';
    case 'Other':
      return 'Otro';
    case 'Dog':
      return 'Perro';
    case 'Cat':
      return 'Gato';
    default:
      return word;
  }
}
