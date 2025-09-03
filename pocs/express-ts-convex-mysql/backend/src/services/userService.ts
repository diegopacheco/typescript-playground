import { pool } from '../config/database.js';
import { CreateUserInput, UpdateUserInput, User } from '../types/user.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  age: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const mapRowToUser = (row: UserRow): User => ({
  _id: row.id,
  name: row.name,
  email: row.email,
  age: row.age,
  isActive: row.is_active,
  _creationTime: row.created_at.getTime(),
});

export class UserService {
  static async createUser(userData: CreateUserInput): Promise<{ id: string }> {
    const connection = await pool.getConnection();
    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await connection.execute(
        'INSERT INTO users (id, name, email, age, is_active) VALUES (?, ?, ?, ?, ?)',
        [userId, userData.name, userData.email, userData.age, userData.isActive]
      );

      return { id: userId };
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
        throw new Error('User with this email already exists');
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAllUsers(): Promise<User[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute<UserRow[]>(
        'SELECT * FROM users ORDER BY created_at DESC'
      );

      return rows.map(mapRowToUser);
    } finally {
      connection.release();
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute<UserRow[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return mapRowToUser(rows[0]);
    } finally {
      connection.release();
    }
  }

  static async updateUser(id: string, userData: UpdateUserInput): Promise<User | null> {
    const connection = await pool.getConnection();
    try {
      const updates: string[] = [];
      const values: unknown[] = [];

      if (userData.name !== undefined) {
        updates.push('name = ?');
        values.push(userData.name);
      }
      if (userData.email !== undefined) {
        updates.push('email = ?');
        values.push(userData.email);
      }
      if (userData.age !== undefined) {
        updates.push('age = ?');
        values.push(userData.age);
      }
      if (userData.isActive !== undefined) {
        updates.push('is_active = ?');
        values.push(userData.isActive);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.getUserById(id);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
        throw new Error('User with this email already exists');
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteUser(id: string): Promise<{ deleted: boolean; user: User } | null> {
    const connection = await pool.getConnection();
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return null;
      }

      const [result] = await connection.execute<ResultSetHeader>(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return { deleted: true, user };
    } finally {
      connection.release();
    }
  }
}