import { Entity, Column, PrimaryGeneratedColumn,  } from 'typeorm';
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
  chat_history: any;

  @Column({ type: 'text', nullable: true })
  chat_summary: string;
  
  // @Column({ nullable: true })  
  // recipe_conversation_Api_No: any;
  // @IsString()
  // recipe_conversation_Api_No: number = 0;

  @Column({ type: 'int', nullable: true})
recipe_conversation_Api_No: number;

}

