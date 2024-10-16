import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

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
  numberOfPeople: string;

  @Column({ nullable: true })
  dietaryPreference: string;

  @Column({ type: 'text', nullable: true })
  specificDish: string;

  @Column({ nullable: true })
  follow_up: string;

  @Column({ type: 'text', nullable: true })
  full_dish: string;

  @Column({ type: 'text', nullable: true })
  chat_history: string;

  @Column({ type: 'text', nullable: true })
  chat_summary: string;

  @Column({ type: 'int', nullable: true })
  recipe_conversation_Api_No: number;

  @Column({ type: 'int', default: 0 })
  apiUsageCount: number; // Tracks API usage count

  @Column({ nullable: true })
  date: Date; // Tracks the last date the API usage was reset
}
