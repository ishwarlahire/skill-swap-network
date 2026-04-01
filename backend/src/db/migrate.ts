import pool from "../config/database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // USERS
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        bio TEXT,
        location VARCHAR(100),
        avatar_url VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // SKILLS
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        type VARCHAR(10) NOT NULL CHECK (type IN ('offer', 'want')),
        level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'expert')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // SWAP REQUESTS
    await client.query(`
      CREATE TABLE IF NOT EXISTS swap_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sender_skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        receiver_skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        message TEXT,
        preferred_mode VARCHAR(20) DEFAULT 'online' CHECK (preferred_mode IN ('online', 'offline', 'both')),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // SESSIONS
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        swap_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
        teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        learner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200),
        scheduled_at TIMESTAMP NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        mode VARCHAR(20) NOT NULL CHECK (mode IN ('video', 'audio', 'chat', 'offline')),
        meet_link VARCHAR(500),
        meet_platform VARCHAR(30) DEFAULT 'google_meet',
        location_note VARCHAR(255),
        agenda TEXT,
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
        notes TEXT,
        skill_transfer_percent INTEGER DEFAULT 0 CHECK (skill_transfer_percent BETWEEN 0 AND 100),
        link_shared_in_chat BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // MESSAGES (In-app chat)
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        swap_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // REVIEWS
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        skill_transfer_percent INTEGER DEFAULT 0 CHECK (skill_transfer_percent BETWEEN 0 AND 100),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(session_id, reviewer_id)
      );
    `);

    // CATEGORIES (managed by admin)
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) UNIQUE NOT NULL,
        icon VARCHAR(10) DEFAULT '🎯',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed default categories
    await client.query(`
      INSERT INTO categories (name, icon) VALUES
        ('Technology', '💻'), ('Music', '🎵'), ('Language', '🗣️'),
        ('Art & Design', '🎨'), ('Sports & Fitness', '⚽'), ('Cooking', '🍳'),
        ('Finance', '💰'), ('Photography', '📷'), ('Writing', '✍️'), ('Other', '🎯')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Seed Super Admin
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@skillswap.com";
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@123";
    const adminName = process.env.SUPER_ADMIN_NAME || "Super Admin";
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await client.query(`
      INSERT INTO users (name, email, password_hash, role, bio)
      VALUES ($1, $2, $3, 'admin', 'Platform Super Administrator')
      ON CONFLICT (email) DO NOTHING;
    `, [adminName, adminEmail, passwordHash]);

    await client.query("COMMIT");
    console.log("✅ Migration complete");
    console.log(`👑 Super Admin: ${adminEmail} / ${adminPassword}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
