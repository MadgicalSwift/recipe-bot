import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  mobileNumber: string;

  @Column()
  language: string;

  @Column()
  Botid: string;

  @Column({ nullable: true })
  selectedRecipeOption: string;

  @Column({ type: 'text', nullable: true })
  ingredientsList: string;

  @Column({ nullable: true })
  numberOfPeople: number;

  @Column({ type: 'text', nullable: true })
  specificDish: string;
  
  @Column({ type: 'text', nullable: true })
  missingIngredients: string;

  
}
