# FARDI - CEFR Language Assessment Platform

A comprehensive FastAPI-based language learning platform that assesses English proficiency using the Common European Framework of Reference for Languages (CEFR) standards through interactive cultural event planning scenarios.

## 🌟 Features

### Core Assessment System
- **Interactive Dialogue System**: Engage with AI-powered NPCs in realistic cultural event planning scenarios
- **CEFR Level Assessment**: Automatic language proficiency assessment using advanced AI models
- **Real-time Feedback**: Instant AI-powered feedback with detailed linguistic analysis
- **Two-Phase Assessment**: Progressive evaluation system with remedial activities
- **Audio Integration**: Text-to-speech functionality for authentic listening comprehension
- **AI Detection**: Advanced anti-cheating system using Sapling API and local heuristics
- **Multilingual Support**: Recognizes and credits code-switching behavior positively

### User Management & Progress
- **User Authentication**: Secure registration and login system
- **Progress Tracking**: XP system, achievements, badges, and skill progression
- **Assessment History**: Complete record of all assessments and improvements
- **User Dashboard**: Comprehensive statistics and learning analytics
- **Personalized Learning**: Adaptive challenges and tips based on performance
- **Certificate Generation**: Downloadable completion certificates with CEFR levels

### Advanced Features
- **Professional English Assessment**: Capitalization, formality, and business communication
- **Cultural Competency**: Tunisian cultural awareness evaluation
- **Teamwork Skills**: Collaboration and communication assessment
- **Listening Comprehension**: Specialized audio-based assessments
- **Phase 2 Remedial System**: Targeted practice activities based on performance gaps

## 🏗️ Project Architecture

```
FARDI/
├── app.py                      # Main Flask application with all routes
├── config.py                   # Environment-based configuration management
├── requirements.txt            # Python dependencies (note: encoding issues present)
├── fardi.db                   # SQLite database file
├── install.ps1               # Claude Code installation script
│
├── models/
│   ├── auth.py               # User authentication, database models, session management
│   └── game_data.py          # Game constants, NPCs, dialogues, CEFR data, Phase 2 steps
│
├── services/
│   ├── ai_service.py         # Groq API integration, Sapling AI detection, local fallbacks
│   ├── assessment_service.py # CEFR assessment logic, Phase 2 evaluation, listening tests
│   └── audio_service.py      # Edge TTS integration, character voice mapping
│
├── routes/
│   ├── auth_routes.py        # Authentication endpoints, user management, decorators
│   └── api_routes.py         # API endpoints for AI feedback, audio generation, tips
│
├── utils/
│   └── helpers.py            # Assessment calculations, XP system, achievement logic
│
├── static/
│   ├── audio/                # Generated TTS audio files
│   ├── css/                  # Stylesheets for all pages
│   ├── images/
│   │   ├── avatars/          # SVG character avatars
│   │   └── badges/           # Achievement badge images
│   └── js/                   # Client-side JavaScript
│
├── templates/
│   ├── auth/                 # Authentication pages
│   ├── phase2/               # Phase 2 assessment templates
│   ├── errors/               # Error page templates
│   └── *.html               # Main game templates
│
├── sessions/                 # Filesystem-based session storage
└── package/                 # Claude Code SDK files
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Internet connection for API services

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FARDI
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   *Note: The requirements.txt file has encoding issues. You may need to recreate it with proper encoding.*

4. **Environment configuration**
   Create a `.env` file in the root directory:
   ```env
   # Required
   GROQ_API_KEY=your_groq_api_key_here
   SECRET_KEY=your_secret_key_here
   
   # Optional
   SAPLING_API_KEY=your_sapling_api_key_here
   GROQ_MODEL=llama-3.1-8b-instant
   ```

5. **Database initialization**
   The database will be automatically initialized on first run.

6. **Run the application**
   ```bash
   python app.py
   ```
   
   The application will be available at `http://localhost:5000`

### API Keys Setup

#### Groq API Key (Required)
1. Visit [Groq Console](https://console.groq.com/)
2. Create an account and generate an API key
3. Add to your `.env` file as `GROQ_API_KEY`
4. This enables AI-powered language assessment and character responses

#### Sapling API Key (Optional but Recommended)
1. Visit [Sapling AI](https://sapling.ai/)
2. Sign up for an account
3. Get your API key for AI detection
4. Add to your `.env` file as `SAPLING_API_KEY`
5. This prevents cheating by detecting AI-generated responses

## 🎮 How the Platform Works

### Complete Learning Journey

FARDI provides a comprehensive English language assessment experience through an immersive cultural event planning scenario. Students work with a team of characters to plan a Tunisian cultural celebration while their language skills are assessed in real-time.

### Phase 1: Initial Language Assessment (9 Interactive Steps)

**Scenario**: You join Ms. Mabrouki's committee to plan a Tunisian cultural event at the university.

**The Experience**:
- **Interactive Conversations**: Chat with AI-powered team members who respond like real people
- **Cultural Integration**: Learn about Tunisian traditions while demonstrating language skills
- **Authentic Tasks**: Handle realistic scenarios from introductions to formal planning
- **Immediate Feedback**: Get instant, personalized feedback on your responses
- **Audio Components**: Listen and respond to spoken instructions and dialogues

**What Students Do**:
1. **Meet the Team** - Introduce yourself and share your motivations
2. **Cultural Discovery** - Discuss Tunisian traditions and cultural elements
3. **Listen & Respond** - Process audio instructions and demonstrate comprehension
4. **Creative Planning** - Brainstorm ideas for cultural activities and decorations
5. **Team Collaboration** - Navigate social interactions and build relationships
6. **Problem Solving** - Address challenges and propose solutions
7. **Abstract Discussion** - Explore deeper cultural and organizational concepts
8. **Professional Writing** - Craft formal communications and summaries

**Assessment**: Each response is automatically evaluated for vocabulary, grammar, cultural awareness, and communication effectiveness. Students receive their CEFR level (A1-C1) upon completion.

### Phase 2: Advanced Cultural Event Planning (4 Structured Steps)

**Scenario**: Take on specialized roles in the cultural event planning committee.

**The Journey**:

#### Step 1: Assigning Team Roles
- **What happens**: Work with team members to assign responsibilities for the cultural event
- **Skills assessed**: Leadership, delegation, understanding team dynamics
- **Activities**: 5 collaborative scenarios with different team members
- **Cultural focus**: Understanding Tunisian organizational structures and teamwork

#### Step 2: Scheduling Meetings and Events
- **What happens**: Coordinate complex scheduling across multiple cultural activities
- **Skills assessed**: Time management, negotiation, practical communication
- **Activities**: Plan timelines for music performances, food preparation, and cultural displays
- **Cultural focus**: Tunisian calendar considerations and cultural priorities

#### Step 3: Planning Specific Tasks
- **What happens**: Organize detailed logistics for cultural activities
- **Skills assessed**: Project management, detailed planning, cultural sensitivity
- **Activities**: Coordinate Malouf music performances, traditional decorations, and cuisine
- **Cultural focus**: Authentic Tunisian cultural elements and their significance

#### Step 4: Final Action Plan
- **What happens**: Create comprehensive documentation and final preparations
- **Skills assessed**: Written communication, synthesis, professional presentation
- **Activities**: Formal planning documents and team coordination
- **Cultural focus**: Professional standards in Tunisian business context

### Adaptive Learning System

**Success Path**: 
- Score 20+ points per step → Advance to next step
- Receive immediate feedback and team encouragement
- Build confidence through progressive challenges

**Skill-Building Path**:
- Score below threshold → Enter targeted practice activities
- **A1 Level Practice**: Basic vocabulary, simple sentences, fundamental concepts
- **A2 Level Practice**: Practical communication, common scenarios, cultural basics
- **B1 Level Practice**: Complex planning, detailed explanations, cultural nuance

**Practice Activities Include**:
- **Matching Exercises**: Connect cultural terms with their meanings
- **Dialogue Completion**: Fill in professional conversation gaps
- **Listening Comprehension**: Respond to spoken instructions about cultural elements
- **Writing Tasks**: Craft appropriate responses for different scenarios

### Real-Time Assessment & Feedback

**During Activities**:
- **AI-Powered Feedback**: Get specific suggestions from team members in character
- **Cultural Guidance**: Learn about Tunisian traditions contextually
- **Language Tips**: Receive grammar and vocabulary suggestions
- **Progress Tracking**: See your advancement through clear visual indicators

**Assessment Criteria**:
- **Professional English**: Proper capitalization, formal language, business communication
- **Cultural Competency**: Understanding and respect for Tunisian traditions
- **Collaboration Skills**: Teamwork, politeness, effective communication
- **Task Management**: Organization, planning, attention to detail

### Anti-Cheating & Authenticity

**Built-in Protection**:
- **AI Detection**: Advanced systems identify AI-generated responses
- **Authentic Response Encouragement**: Platform guides students to write their own thoughts
- **Educational Approach**: When AI is detected, students receive guidance rather than punishment
- **Learning Focus**: Emphasis on personal growth and authentic communication

### Student Experience Flow

1. **Welcome & Setup**: Create account, learn about the cultural event scenario
2. **Phase 1 Journey**: Complete 9 interactive steps with team members
3. **Initial Assessment**: Receive CEFR level and detailed feedback
4. **Phase 2 Access**: Unlock advanced cultural planning scenarios
5. **Skill Building**: Complete practice activities when needed
6. **Achievement**: Earn certificates and track progress over time
7. **Continuous Learning**: Access personalized tips and challenges

### For Educators

**What Teachers See**:
- **Detailed Analytics**: Student progress, skill levels, time spent
- **Assessment History**: Complete record of all attempts and improvements
- **Cultural Learning**: Evidence of cultural competency development
- **Authentic Assessment**: Confidence that responses reflect student ability
- **Progress Tracking**: Clear visualization of student language development

**Educational Value**:
- **Practical Application**: Language learning through realistic scenarios
- **Cultural Education**: Meaningful exposure to Tunisian culture and traditions
- **21st Century Skills**: Collaboration, problem-solving, cultural competency
- **Authentic Assessment**: Real-world communication rather than artificial tests

### Assessment Criteria
- **Vocabulary Range**: Complexity and appropriateness of word choice
- **Grammar Accuracy**: Sentence structure, tense usage, syntax
- **Spelling & Mechanics**: Accuracy and professional standards
- **Comprehension**: Understanding of context and task requirements
- **Fluency & Coherence**: Natural flow and logical organization
- **Cultural Competency**: Awareness and sensitivity to cultural context
- **Professional Standards**: Capitalization, formality, business communication

## 🧠 AI & Technology Stack

### Core Technologies
- **Flask**: Web framework with blueprint architecture
- **SQLite**: Lightweight database for user management and assessment history
- **Flask-Session**: Filesystem-based session management
- **Edge TTS**: Microsoft's text-to-speech engine for character voices
- **Groq API**: Large language model for assessment and feedback
- **Sapling AI**: Advanced AI content detection

### AI Services Architecture

#### AI Service (`services/ai_service.py`)
- **Groq Integration**: Chat completion API for language assessment
- **Character Responses**: In-character AI responses based on NPC personalities
- **AI Detection**: Sapling API integration with local fallback heuristics
- **Multilingual Processing**: Handles code-switching and multilingual responses

#### Assessment Service (`services/assessment_service.py`)
- **CEFR Evaluation**: Detailed language level assessment using AI
- **Listening Assessment**: Specialized comparison-based evaluation
- **Phase 2 Assessment**: Cultural event planning specific criteria
- **Professional Standards**: Business communication and formality checks
- **Fallback Methods**: Local assessment when APIs are unavailable

#### Audio Service (`services/audio_service.py`)
- **Character Voices**: Unique voice mapping for each NPC
- **Listening Tests**: Pre-generated audio for comprehension tasks
- **Custom Audio**: Dynamic audio generation for API requests
- **File Management**: Automated audio file creation and storage

## 📊 Database Schema

### Users Table
- User authentication and profile information
- Password hashing with salt
- Email verification and preferences
- Timezone and language preferences

### Assessment Results Table
- Complete assessment history with JSON storage
- CEFR levels, XP earned, time taken
- Skill-level breakdowns and achievements
- AI usage percentage tracking

### User Sessions Table
- Enhanced session management
- IP tracking and device information
- Session expiration and security

### Additional Tables
- Password reset tokens
- Email verification tokens
- User preferences and settings

## 🎯 Assessment Levels (CEFR)

| Level | Name | Description | Points |
|-------|------|-------------|---------|
| **A1** | Beginner | Basic everyday expressions and familiar phrases | 1 |
| **A2** | Elementary | Simple communication in routine tasks | 2 |
| **B1** | Intermediate | Most travel situations and familiar topics | 3 |
| **B2** | Upper Intermediate | Fluent interaction with native speakers | 4 |
| **C1** | Advanced | Fluent, spontaneous expression without searching | 5 |

### Skill Areas Assessed
- **Vocabulary Range & Accuracy**
- **Grammar & Syntax Control**
- **Spelling & Mechanics**
- **Listening Comprehension**
- **Cultural Awareness**
- **Professional Communication**
- **Teamwork & Collaboration**
- **Creative Problem Solving**

## 🔧 API Endpoints

### Game API
- `POST /api/get-ai-feedback` - Real-time response analysis and feedback
- `GET /api/language-tips` - Personalized learning recommendations
- `POST /api/check-ai-response` - AI-generated content detection
- `POST /api/generate-audio` - Custom audio file generation

### Authentication API
- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /auth/profile` - User profile management
- `POST /auth/logout` - Session termination

### Phase 2 API
- `POST /phase2/submit-response` - Phase 2 assessment submission
- `POST /api/submit-remedial-activity` - Remedial activity completion

## 🛡️ Security Features

### Anti-Cheating System

- **Sapling AI Detection**: Advanced AI content identification
- **Local Heuristics**: Fallback detection using linguistic patterns
- **Response Validation**: Multiple layers of authenticity checking
- **Session Security**: Secure session management with expiration

### Data Protection
- **Password Security**: SHA-256 hashing with unique salts
- **Session Security**: Filesystem-based sessions with encryption
- **Input Validation**: Comprehensive form and API validation
- **SQL Injection Prevention**: Parameterized queries throughout

## 🎨 User Interface & Experience

### Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, intuitive interface design
- **Accessibility**: WCAG compliance considerations
- **Performance**: Optimized loading and interactions

### Interactive Elements
- **Character Avatars**: SVG-based NPC representations
- **Real-time Feedback**: Instant assessment results
- **Progress Indicators**: Visual progress tracking
- **Achievement System**: Badges and recognition
- **Audio Integration**: Play buttons for listening tests

## 🔄 Development Workflow

### Adding New Assessment Questions
1. Add question data to `DIALOGUE_QUESTIONS` in `models/game_data.py`
2. Include CEFR examples and assessment criteria
3. Update audio generation mapping if needed
4. Test assessment accuracy and feedback quality

### Extending NPCs and Characters
1. Add character data to `NPCS` in `models/game_data.py`
2. Create SVG avatar in `static/images/avatars/`
3. Add voice mapping in `services/audio_service.py`
4. Update character response prompts in AI service

### Customizing Assessment Criteria
1. Modify assessment prompts in `services/assessment_service.py`
2. Update scoring algorithms in `utils/helpers.py`
3. Adjust CEFR level thresholds if needed
4. Test with various response types

## 🐛 Troubleshooting

### Common Issues

#### Requirements Installation
- **Issue**: Encoding errors when installing from requirements.txt
- **Solution**: Recreate requirements.txt with UTF-8 encoding

#### API Key Errors  
- **Issue**: AI services not working
- **Solution**: Verify API keys in .env file and check API quotas

#### Audio Generation Issues
- **Issue**: TTS not working
- **Solution**: Ensure Edge TTS is properly installed and internet connection is stable

#### Database Issues
- **Issue**: Database initialization errors
- **Solution**: Delete fardi.db and restart application for fresh database

#### Session Issues
- **Issue**: Users getting logged out
- **Solution**: Check sessions/ directory permissions and disk space

### Error Handling
- Comprehensive error pages (403, 404, 500)
- Graceful fallbacks when APIs are unavailable  
- User-friendly error messages
- Detailed logging for debugging

## 🚀 Deployment Considerations

### Production Setup
- Set `DEBUG = False` in production configuration
- Use environment variables for all sensitive data
- Configure proper logging and monitoring
- Set up database backups
- Use HTTPS in production
- Configure proper session security

### Scaling Recommendations
- Consider Redis for session storage at scale
- Implement database connection pooling
- Use CDN for static assets
- Add caching layers for API responses
- Monitor API usage and costs

## 📈 Performance & Optimization

### Current Optimizations
- Filesystem-based sessions reduce database load
- Audio file caching prevents regeneration
- Lazy loading of assessment data
- Efficient database queries with proper indexing

### Monitoring
- User assessment completion rates
- API response times and error rates
- Database performance metrics
- Session management efficiency

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch from main
3. Set up development environment
4. Make changes with proper testing
5. Submit pull request with detailed description

### Code Standards
- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comprehensive docstrings
- Include error handling
- Write unit tests for new features

### Testing
- Test all assessment scenarios
- Verify API endpoints functionality
- Check user authentication flows
- Validate audio generation
- Test error handling paths

## 📄 License & Support

This project is available under the MIT License. For issues, questions, or contributions:

1. Check existing issues in the repository
2. Create detailed issue reports with logs
3. Include environment and setup information
4. Provide steps to reproduce problems

---

**Built with ❤️ for language learning and cultural exchange**

*FARDI represents the fusion of artificial intelligence and pedagogy to create meaningful language assessment experiences that celebrate cultural diversity and authentic communication.*