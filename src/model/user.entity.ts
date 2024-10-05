// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: false })
//   mobileNumber: string;

//   @Column()
//   language: string;

//   @Column()
//   Botid: string;

//   @Column({ nullable: true })
//   selectedRecipeOption: string;

//   @Column({ type: 'text', nullable: true })
//   ingredientsList: string;

//   @Column({ nullable: true })
//   numberOfPeople: string;

//   @Column({ type: 'text', nullable: true })
//   specificDish: string;
  
//   @Column({ type: 'text', nullable: true })
//   missingIngredients: string;

  
// }


import { IsString, IsOptional,IsInt  } from 'class-validator';

export class User {
  @IsString()
  mobileNumber: string;

  @IsString()
  language: string;

  @IsString()
  Botid: string; // Changed to lowercase 'b' for consistency

  @IsOptional()
  @IsString()
  selectedRecipeOption?: string; // Optional

  @IsOptional()
  @IsString()
  ingredientsList?: string; // Optional

  @IsOptional()
  @IsInt() // Validate as integer
  numberOfPeople?: number | string;  // Optional

  @IsOptional()
  @IsString()
  specificDish?: string; // Optional

  @IsOptional()
  @IsString()
  missingIngredients?: string; // Optional
}
