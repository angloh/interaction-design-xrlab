# 🎓 Student Helper Testing Guide
## 3-Week Testing Program (8 hours/week, 24 hours total)

**Your Role:** You're testing a new experiment platform before it goes live for real research.  
**Your Goal:** Find bugs, identify confusing parts, and suggest improvements.  
**Your Time:** 8 hours per week for 3 weeks (24 hours total)  
**Your Impact:** Your feedback will directly improve this system for researchers.

---

## 📋 OVERVIEW

### **What You're Testing:**
An experiment creation and running platform that lets researchers:
- Run pre-built psychology experiments (Digit Span, Stroop, SART)
- Create new experiments using AI
- Import experiments from other platforms
- Collect data from participants

### **What We Need From You:**
1. **Find bugs** - What breaks? What doesn't work?
2. **Identify confusion** - What's unclear? Where did you get stuck?
3. **Test real-world scenarios** - Use it like a real researcher would
4. **Document everything** - Write down what you find
5. **Suggest improvements** - How would you make it better?

### **What You'll Learn:**
- Web-based experiment design
- Software testing methodologies
- Research methods in cognitive psychology
- Bug reporting and documentation
- UX evaluation

---

## 🗓️ WEEK 1: SETUP & CORE FUNCTIONALITY (8 hours)

**Goal:** Get everything working and understand the basic system

---

### **Day 1: Setup & Initial Exploration (3 hours)**

#### **Task 1.1: Setup the System (45 min)**

**Instructions:**
1. Download `experiment_maker_FIXED.zip` from your instructor
2. Extract it to your Desktop or Documents folder
3. Follow `QUICK_DEPLOY.md` to install and run

**Specific Steps:**
```bash
# Open Terminal (Mac/Linux) or Command Prompt (Windows)
cd ~/Desktop  # Or wherever you extracted
cd experiment_maker_FIXED

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up credentials (CHANGE THESE!)
export SECRET_KEY="test-secret-key-change-in-production"
export ADMIN_USERNAME="testadmin"
export ADMIN_PASSWORD="testpass123"

# Run the server
python app_FIXED.py
```

**Expected Result:**
- Server starts without errors
- You see message about admin username/password
- Server running on http://localhost:5000

**Document:**
- [ ] Time it took to set up
- [ ] Any errors encountered
- [ ] What was confusing in the instructions
- [ ] What OS you're using (Mac/Windows/Linux)
- [ ] Python version (`python3 --version`)

**If stuck:** Check `docs/SETUP_GUIDE_FIXED_VERSION.md` troubleshooting section

---

#### **Task 1.2: Test Basic Navigation (30 min)**

**Instructions:**
1. Open http://localhost:5000 in your browser
2. Click around, explore every page you can find
3. Don't try to "complete" anything yet - just look around

**What to explore:**
- [ ] Home page - what do you see?
- [ ] Login page - can you find it?
- [ ] Consent page - what does it say?
- [ ] Each experiment card - what happens when you click?
- [ ] Any other links you find

**Document for EACH page:**
```
Page: [URL or name]
First Impression: [What did you think?]
Confusing Parts: [What didn't make sense?]
Questions: [What do you want to know?]
Bugs: [Anything broken?]
```

**Example:**
```
Page: Home page (/)
First Impression: Clean, has 4 big cards for experiments
Confusing Parts: Not sure what "Configure" means vs "Run"
Questions: Do I need to log in to try experiments?
Bugs: None noticed
```

---

#### **Task 1.3: Test Login System (45 min)**

**Instructions:**
Test the experimenter login system thoroughly.

**Test Cases:**

1. **Valid Login**
   - Go to /login
   - Enter: testadmin / testpass123
   - Expected: Should log you in and redirect
   - Document: Did it work? Where did it take you?

2. **Invalid Login**
   - Go to /login
   - Enter: wrong / wrong
   - Expected: Should show error message
   - Document: What error message? Is it helpful?

3. **Empty Fields**
   - Go to /login
   - Leave both fields blank
   - Click "Log In"
   - Expected: Browser validation or error message
   - Document: What happened?

4. **Special Characters in Password**
   - Try logging in with password: `p@ssw0rd!#$%`
   - Expected: Should work or give clear error
   - Document: What happened?

5. **Session Persistence**
   - Log in successfully
   - Close browser completely
   - Open browser again, go to /login
   - Expected: What happens? Still logged in?
   - Document: Your findings

6. **Logout**
   - While logged in, find logout button/link
   - Click it
   - Expected: Should log you out
   - Try accessing experimenter page - should redirect to login
   - Document: Does logout work properly?

**Document:**
```
Login Test Results:
✅/❌ Valid login works
✅/❌ Invalid login shows clear error
✅/❌ Empty fields handled properly
✅/❌ Special characters work
✅/❌ Session persists across browser close
✅/❌ Logout works correctly

Issues Found:
1. 
2. 
3. 

Suggestions:
1. 
2. 
```

---

#### **Task 1.4: Complete One Experiment as Participant (60 min)**

**Instructions:**
Experience what a participant experiences. Choose ONE experiment.

**Recommended: Start with Digit Span (easiest)**

**Steps:**
1. **Start Fresh:**
   - Open new private/incognito browser window
   - Go to http://localhost:5000/consent
   - Read consent form

2. **Document Consent Form:**
   - [ ] Is the consent form clear?
   - [ ] Do you understand what you're consenting to?
   - [ ] Any concerning language?
   - [ ] Is it easy to read?
   - [ ] Any typos or errors?

3. **Accept Consent:**
   - Enter a test subject ID (e.g., "TEST001")
   - Accept consent
   - Document: Where does it take you?

4. **Choose Digit Span:**
   - Find and click the Digit Span experiment
   - Document: How did you know where to click?

5. **Complete the Experiment:**
   - Read instructions carefully
   - Note: Are instructions clear?
   - Complete at least 10 trials
   - Document: What did you experience?

**Detailed Documentation:**

```markdown
## Digit Span Experience Report

### Instructions:
- Were they clear? [Yes/No/Somewhat]
- What was confusing? [Describe]
- What would improve them? [Suggestions]

### During Trials:
- Did you understand what to do? [Yes/No]
- Were the stimuli visible? [Yes/No]
- Was timing appropriate? [Too fast/Too slow/Just right]
- Any technical glitches? [Describe]
- Did feedback make sense? [Yes/No/No feedback shown]

### Specific Issues:
Trial #[X]: [What happened]
Trial #[Y]: [What happened]

### Overall Experience:
- Frustration level: [1-10, 1=smooth, 10=very frustrated]
- Enjoyment: [1-10]
- Would you do this for real research? [Yes/No/Maybe]

### Results Screen:
- Did you see results? [Yes/No]
- Were results clear? [Yes/No]
- What did results show? [Describe]
- Could you export data? [Yes/No]

### Bugs Found:
1. 
2. 
3. 

### Suggestions for Improvement:
1. 
2. 
3. 
```

---

### **Day 2: Test All Pre-Made Experiments (2.5 hours)**

#### **Task 1.5: Complete Each Experiment (2 hours)**

**Goal:** Experience all pre-made experiments as a participant.

**For EACH experiment (Digit Span, Stroop, SART):**

1. **Start fresh incognito window**
2. **Go through consent with new ID** (TEST002, TEST003, etc.)
3. **Complete the experiment**
4. **Document using the template below**

**Template for Each Experiment:**

```markdown
## [EXPERIMENT NAME] Testing Report

### Metadata:
- Date/Time: [When you tested]
- Subject ID used: [e.g., TEST002]
- Browser: [Chrome/Firefox/Safari]
- Completed trials: [How many]

### First Impressions:
- What is this experiment testing? [Your understanding]
- Did instructions explain this? [Yes/No]

### Instructions Quality (1-10): ___
- What was clear:
- What was confusing:
- Suggested improvements:

### Experiment Experience:

**Practice Trials:**
- Number of practice trials: ___
- Were they helpful? [Yes/No]
- Feedback adequate? [Yes/No]

**Main Trials:**
- Number of trials: ___
- Length of experiment: ___ minutes
- Difficulty: [Too easy/Just right/Too hard]
- Pacing: [Too fast/Good/Too slow]

**Technical Issues:**
- [ ] Stimuli displayed correctly
- [ ] Response recording worked
- [ ] Timing seemed accurate
- [ ] No crashes or freezes
- Issues found: [List any]

**Specific Bugs:**
| Trial # | What Happened | Expected | Screenshot? |
|---------|---------------|----------|-------------|
| 5       | [Example]     | [Example]| Yes/No      |

### Results Screen:
- Accuracy shown: [Yes/No - Value if yes]
- Reaction time shown: [Yes/No - Value if yes]
- Results make sense: [Yes/No - Why/Why not]
- Can export data: [Yes/No]

### Participant Perspective:
**If this was a real study:**
- Would instructions be clear enough? [Yes/No]
- Would you feel comfortable? [Yes/No]
- Would you trust the data? [Yes/No]
- Any concerns? [List]

### Overall Rating: ___ / 10

### Top 3 Issues:
1. 
2. 
3. 

### Top 3 Strengths:
1. 
2. 
3. 

### Improvement Ideas:
1. 
2. 
3. 
```

**Complete this template for:**
- [ ] Digit Span
- [ ] Stroop Task
- [ ] SART

---

#### **Task 1.6: Compare Experiments (30 min)**

**Goal:** Identify patterns and inconsistencies across experiments.

**Analysis Questions:**

1. **Consistency:**
   - Do all experiments have similar instruction format? [Yes/No]
   - Is navigation consistent? [Yes/No]
   - Is feedback style consistent? [Yes/No]
   - Are result displays similar? [Yes/No]

2. **Best Practices:**
   - Which experiment had the clearest instructions?
   - Which had the best user experience?
   - Which would you use as a model?
   - Why?

3. **Problems:**
   - Which experiment had the most issues?
   - What patterns do you see in the bugs?
   - Are there common usability problems?

**Comparison Matrix:**

| Feature | Digit Span | Stroop | SART | Best Implementation |
|---------|-----------|--------|------|-------------------|
| Instructions | [Rating 1-10] | | | |
| Trial Clarity | | | | |
| Feedback | | | | |
| Results Display | | | | |
| Overall UX | | | | |

**Document:**
```markdown
## Cross-Experiment Analysis

### Strengths Across All:
- 
- 

### Weaknesses Across All:
- 
- 

### Inconsistencies Found:
1. 
2. 
3. 

### Recommended Standards:
Based on testing, all experiments should:
1. 
2. 
3. 
```

---

### **Week 1 Deliverable:**

**Due: End of Week 1**

Submit a document with:
1. Setup experience report
2. Login testing results
3. All 3 experiment reports (using templates above)
4. Cross-experiment comparison
5. Week 1 summary: Top 10 issues found

**Format:** PDF or Markdown  
**Filename:** `Week1_Testing_YourName.pdf`

---

## 🗓️ WEEK 2: EXPERIMENTER FEATURES & DATA (8 hours)

**Goal:** Test experimenter perspective and data handling

---

### **Day 3: Experimenter Configuration (3 hours)**

#### **Task 2.1: Login as Experimenter (30 min)**

**Goal:** Access experimenter features and explore the interface.

**Instructions:**
1. Make sure you're logged in (username: testadmin)
2. Navigate to home page
3. Click on each experiment's "Configure" or experimenter option

**For Each Experiment:**

Document the experimenter interface:
```markdown
## [EXPERIMENT] - Experimenter Interface

### Access:
- How to get there: [Steps]
- Clear that this is for experimenters? [Yes/No]

### Configuration Options:
List all options you see:
1. [Option name] - [What it does]
2. 
3. 

### Unclear Options:
- [Option]: Why is this confusing?
- [Option]: What does this actually do?

### Missing Options:
What do you wish you could configure?
1. 
2. 

### Usability:
- Easy to use? [1-10]
- Could skip? [Yes/No]
- Undo/back button? [Yes/No]
- Save for later? [Yes/No]
```

---

#### **Task 2.2: Configure and Run Custom Session (1.5 hours)**

**Goal:** Create a custom configured session and test it.

**For Digit Span:**

1. **Configure Settings:**
   ```
   - Number of practice trials: 3
   - Number of test trials: 10
   - Starting sequence length: 4
   - Maximum sequence length: 9
   - (or whatever options are available)
   ```

2. **Document Configuration Process:**
   - [ ] Easy to understand options?
   - [ ] Default values shown?
   - [ ] Validation (can you enter nonsense)?
   - [ ] Help text available?
   - [ ] Preview available?

3. **Generate Session/Link:**
   - What happens after you configure?
   - Do you get a link to share?
   - Can you test it yourself first?
   - Document the full process

4. **Test Your Configuration:**
   - Open the generated link (in incognito)
   - Complete the experiment
   - Verify your settings were applied
   - Document: Did your settings work?

**Configuration Testing Report:**
```markdown
## Custom Configuration Test

### Settings Applied:
- [Setting 1]: [Value]
- [Setting 2]: [Value]

### Configuration Process:
- Time to configure: ___ minutes
- Confusion points:
  1. 
  2. 
- What worked well:
  1. 
  2. 

### Verification:
Did the experiment use your settings?
- Practice trials: Expected ___, Got ___
- Test trials: Expected ___, Got ___
- [Other settings]: Expected ___, Got ___

### Issues:
1. 
2. 

### Suggestions:
1. 
2. 
```

**Repeat for at least ONE other experiment** (Stroop or SART)

---

#### **Task 2.3: Test Edge Cases in Configuration (1 hour)**

**Goal:** Try to break the configuration system.

**Test Cases:**

1. **Invalid Numbers:**
   - Enter 0 trials
   - Enter negative numbers
   - Enter 99999 trials
   - Enter decimals (3.5 trials)
   - Enter letters ("five")
   - Document: What happens for each?

2. **Missing Required Fields:**
   - Leave fields blank
   - Try to submit incomplete configuration
   - Document: Does it stop you? Error message?

3. **Extreme Values:**
   - Set timing to 1ms (way too fast)
   - Set timing to 999999ms (way too slow)
   - Document: Any validation?

4. **Back Button:**
   - Start configuration
   - Click browser back button
   - Document: What happens? Data lost?

5. **Session Timeout:**
   - Start configuration
   - Wait 10 minutes
   - Continue configuration
   - Document: Still logged in? Data preserved?

**Document Results:**
```markdown
## Edge Case Testing Results

### Invalid Input Handling:
| Input Type | Test Value | Expected Behavior | Actual Behavior | Pass/Fail |
|------------|-----------|-------------------|-----------------|-----------|
| Zero       | 0 trials  | Error message     | [What happened] | ✅/❌     |
| Negative   | -5 trials | Error message     | [What happened] | ✅/❌     |
| Too Large  | 99999     | Error/Warning     | [What happened] | ✅/❌     |
| Decimal    | 3.5       | Round or error    | [What happened] | ✅/❌     |
| Text       | "five"    | Error message     | [What happened] | ✅/❌     |

### Critical Bugs Found:
1. 
2. 
3. 

### Security Concerns:
- Can you inject code? [Tried/Not tried]
- Can you break validation? [Yes/No - How?]
```

---

### **Day 4: Data Collection & Export (2.5 hours)**

#### **Task 2.4: Collect Test Data (1 hour)**

**Goal:** Generate realistic test data for export testing.

**Instructions:**

1. **Configure Digit Span** with standard settings

2. **Complete 5 sessions** as different "participants":
   ```
   Subject IDs:
   - DS_SUBJECT_01
   - DS_SUBJECT_02
   - DS_SUBJECT_03
   - DS_SUBJECT_04
   - DS_SUBJECT_05
   ```

3. **For each session:**
   - Use incognito window
   - Complete full experiment
   - Vary your performance (sometimes accurate, sometimes errors)
   - Document completion time

4. **Create variety:**
   - Session 1: Very accurate
   - Session 2: Many errors
   - Session 3: Very fast responses
   - Session 4: Very slow responses
   - Session 5: Quit halfway (if possible)

**Document:**
```markdown
## Test Data Generation

### Sessions Created:
| Subject ID | Trials Completed | Accuracy | Notes |
|------------|------------------|----------|-------|
| DS_SUBJECT_01 | 10 | 90% | [Notes] |
| DS_SUBJECT_02 |  |  | |
| ... | | | |

### Issues During Data Collection:
1. 
2. 

### Questions:
- Can you see all sessions as experimenter? [Yes/No - How?]
- How do you know which data is which? [Describe]
- Can you delete sessions? [Yes/No]
```

---

#### **Task 2.5: Data Export Testing (1 hour)**

**Goal:** Export data and verify it's correct and complete.

**Instructions:**

1. **Find Data Export:**
   - Log in as experimenter
   - Find where to export data
   - Document: How easy was it to find?

2. **Export Each Session:**
   - Try to export DS_SUBJECT_01 data
   - Document the process step-by-step
   - Save the exported file

3. **Examine Exported Data:**
   - Open the CSV/JSON file
   - Can you read it?
   - Does it have all trial data?
   - Compare to what you remember from session

**Data Export Analysis:**
```markdown
## Data Export Testing

### Finding Export Function:
- Time to find: ___ minutes
- Difficulty (1-10): ___
- Location: [Where was it?]
- Clear labeling? [Yes/No]

### Export Process:
Step-by-step:
1. 
2. 
3. 

Issues:
- 
- 

### Exported File Format:
- File type: [CSV/JSON/Excel/Other]
- Can open in: [Excel/R/Python/Other]
- Human readable? [Yes/No]

### Data Completeness Check:
✅/❌ Has subject ID
✅/❌ Has all trials
✅/❌ Has trial number
✅/❌ Has stimulus shown
✅/❌ Has response given
✅/❌ Has response time
✅/❌ Has correctness
✅/❌ Has timestamp

Missing fields:
- 
- 

### Data Accuracy:
Compare exported data to your session DS_SUBJECT_01:
- Trial 1: Expected [X], Got [Y] - ✅/❌
- Trial 5: Expected [X], Got [Y] - ✅/❌
- Trial 10: Expected [X], Got [Y] - ✅/❌

Accuracy issues:
1. 
2. 

### Usability for Analysis:
- Could you analyze this in Excel? [Yes/No - Why?]
- Could you import to R/Python? [Yes/No]
- Is format standard/documented? [Yes/No]
- Need to clean data first? [Yes/No - What cleaning?]

### Bulk Export:
- Can you export all sessions at once? [Yes/No]
- Can you select multiple sessions? [Yes/No]
- Can you export by date range? [Yes/No]

### Critical Issues:
1. 
2. 
3. 

### Suggestions:
1. 
2. 
3. 
```

---

#### **Task 2.6: Data Management (30 min)**

**Goal:** Test data viewing, searching, and management.

**Instructions:**

1. **View All Sessions:**
   - Find where you can see all collected data
   - Can you see a list of sessions?
   - Can you search/filter?

2. **Test Search/Filter:**
   - Can you find sessions by subject ID?
   - Can you filter by experiment type?
   - Can you sort by date?
   - Can you filter by completion status?

3. **Test Data Deletion** (if available):
   - Can you delete a session?
   - Does it ask for confirmation?
   - Is it really deleted?

**Document:**
```markdown
## Data Management Testing

### Session List View:
- Can see all sessions: [Yes/No]
- Information shown:
  - Subject ID: [Yes/No]
  - Experiment type: [Yes/No]
  - Date/time: [Yes/No]
  - Completion status: [Yes/No]
  - Number of trials: [Yes/No]

### Search/Filter:
| Feature | Available? | Works? | Notes |
|---------|------------|--------|-------|
| Search by subject ID | Yes/No | ✅/❌ | |
| Filter by experiment | Yes/No | ✅/❌ | |
| Sort by date | Yes/No | ✅/❌ | |
| Filter by status | Yes/No | ✅/❌ | |

### Data Deletion:
- Delete option available: [Yes/No]
- Confirmation required: [Yes/No]
- Actually deletes: [Yes/No - How did you verify?]
- Can recover deleted: [Yes/No]

### Concerns:
- Can anyone delete data? [Yes/No - Security concern?]
- Is there an audit trail? [Yes/No]
- Backup exists? [Yes/No - How do you know?]
```

---

### **Day 5: Edge Cases & Error Scenarios (2.5 hours)**

#### **Task 2.7: Network & Connection Issues (1 hour)**

**Goal:** Test behavior when things go wrong.

**Test Scenarios:**

1. **Slow Internet:**
   - Use browser dev tools to throttle network (Chrome: DevTools → Network → Throttling)
   - Start an experiment
   - Document: Does it work? Loading indicators? Timeouts?

2. **Connection Loss:**
   - Start an experiment
   - Turn off WiFi mid-trial
   - Document: What happens? Error message? Data lost?
   - Turn WiFi back on
   - Document: Can you recover?

3. **Server Restart:**
   - Start an experiment
   - Stop the server (Ctrl+C in terminal)
   - Try to continue experiment
   - Document: Error message? Behavior?
   - Restart server
   - Document: Can you continue from where you left?

**Document:**
```markdown
## Connection Testing Results

### Slow Network:
- Loading indicators shown: [Yes/No]
- Timeout handling: [Good/Poor/None]
- User informed of delay: [Yes/No]
- Could complete experiment: [Yes/No]

### Connection Lost:
- Error message: [Yes/No - What did it say?]
- Data preserved: [Yes/No - How did you check?]
- Recovery possible: [Yes/No - How?]
- User guidance: [Clear/Unclear/None]

### Server Down:
- Error page shown: [Yes/No - What page?]
- Error message helpful: [Yes/No]
- Session recoverable: [Yes/No]
- Data lost: [Yes/No]

### Critical Issues:
1. 
2. 

### User Impact:
If this happened in a real study:
- Would participant be frustrated? [1-10]
- Would data be lost? [Yes/No]
- Would participant know what to do? [Yes/No]
```

---

#### **Task 2.8: Browser Compatibility (1 hour)**

**Goal:** Test in different browsers.

**Browsers to Test:**
- [ ] Chrome
- [ ] Firefox  
- [ ] Safari (if on Mac)
- [ ] Edge (if on Windows)

**For Each Browser:**

1. **Complete one full experiment**
2. **Test all major functions**
3. **Note any differences or issues**

**Document:**
```markdown
## Browser Compatibility Testing

### Chrome:
- Version: [x.x.x]
- ✅/❌ All features work
- Issues:
  1. 
  2. 

### Firefox:
- Version: [x.x.x]
- ✅/❌ All features work
- Issues:
  1. 
  2. 

### Safari:
- Version: [x.x.x]
- ✅/❌ All features work
- Issues:
  1. 
  2. 

### Edge:
- Version: [x.x.x]
- ✅/❌ All features work
- Issues:
  1. 
  2. 

### Differences Found:
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Display | | | | |
| Timing | | | | |
| Data entry | | | | |
| Export | | | | |

### Recommendation:
- Best browser: [Which and why?]
- Should warn users: [Yes/No - Which browsers to avoid?]
```

---

#### **Task 2.9: Mobile/Tablet Testing (30 min)**

**Goal:** Test on smaller screens.

**Devices to Test:**
- [ ] Phone (your phone)
- [ ] Tablet (if available)
- [ ] Small laptop screen

**For Each Device:**

1. **Try to complete an experiment**
2. **Note what works and doesn't**
3. **Document usability**

**Document:**
```markdown
## Mobile/Tablet Testing

### Phone:
- Model: [Your phone]
- Screen size: [Approx size]
- ✅/❌ Can access site
- ✅/❌ Can read text
- ✅/❌ Can tap buttons
- ✅/❌ Can complete experiment
- Issues:
  1. 
  2. 

### Tablet:
- Model: [If available]
- Issues:
  1. 
  2. 

### Overall Mobile Usability:
- Recommended for participants: [Yes/No]
- Required fixes:
  1. 
  2. 
```

---

### **Week 2 Deliverable:**

**Due: End of Week 2**

Submit a document with:
1. Experimenter interface reports (all experiments)
2. Configuration testing results
3. Custom session tests
4. Edge case testing results
5. Data export analysis with exported files attached
6. Connection testing results
7. Browser compatibility matrix
8. Mobile testing results
9. Week 2 summary: Top 10 issues found

**Format:** PDF with CSV files attached  
**Filename:** `Week2_Testing_YourName.pdf`

---

## 🗓️ WEEK 3: ADVANCED FEATURES & FINAL REPORT (8 hours)

**Goal:** Test advanced features, AI integration, and write comprehensive final report

---

### **Day 6: AI Generation Testing (3 hours)**

#### **Task 3.1: Test AI Prompt Template (1.5 hours)**

**Goal:** Test the AI generation workflow.

**Instructions:**

1. **Find the AI prompt template:**
   - Look for `AI_PROMPT_COPY_PASTE.txt` in the package
   - Read the entire template
   - Time how long it takes to understand

2. **Create a simple experiment with AI:**
   - Open Claude.ai or ChatGPT (free account)
   - Copy the ENTIRE template
   - Fill in Section 8 with this experiment:
     ```
     Experiment: Color Recognition
     Description: Show colored circles, participant names the color
     Stimuli: Red, blue, green, yellow circles
     Response: Button press (R/B/G/Y keys)
     Trials: 5 practice, 20 test
     ```
   - Paste into AI
   - Wait for code generation
   - Copy the generated code

3. **Test the generated code:**
   - Paste into the creator (if available)
   - Or just examine the code yourself
   - Run the validator (if available)

**Document:**
```markdown
## AI Generation Testing

### Template Usability:
- Time to understand template: ___ minutes
- Difficulty level (1-10): ___
- Clear what to fill in: [Yes/No]
- Examples helpful: [Yes/No]

### Confusing Parts:
1. 
2. 
3. 

### AI Performance:
- AI used: [Claude/ChatGPT/Other]
- Time to generate: ___ seconds
- Generated valid code: [Yes/No]
- Code matched requirements: [Yes/No]

### Generated Code Quality:
✅/❌ Has EXPERIMENT_CONFIG object
✅/❌ Has EXPERIMENT_DATA object
✅/❌ Has required functions
✅/❌ Has proper HTML structure
✅/❌ Uses performance.now() for timing
✅/❌ Has error handling

### Validator Results (if available):
- Score: ___ / 100
- Errors: [List]
- Warnings: [List]
- Suggestions: [List]

### Issues:
1. 
2. 
3. 

### Could a non-programmer use this?
- [Yes/No/Maybe]
- Why:
```

---

#### **Task 3.2: Create Complex Experiment with AI (1.5 hours)**

**Goal:** Test AI with a harder experiment.

**Instructions:**

1. **Choose a complex experiment:**
   - **N-Back Task** (recommended)
   - Or create your own complex design

2. **Use the AI template:**
   - Fill in Section 8 with complete details
   - Be specific about:
     - Timing (exact milliseconds)
     - Response requirements
     - Feedback rules
     - Trial structure

3. **Generate and test:**
   - Get code from AI
   - Examine code quality
   - Test if available
   - Run validator if available

**Document:**
```markdown
## Complex Experiment AI Test

### Experiment Design:
[Describe your experiment fully]

### AI Prompt Quality:
How well did you specify the experiment?
- Completeness (1-10): ___
- Clarity (1-10): ___
- Time to write: ___ minutes

### AI Results:
- Generated successfully: [Yes/No]
- Required multiple attempts: [Yes/No - How many?]
- What needed clarification:
  1. 
  2. 

### Code Quality:
- Validation score: ___ / 100
- Would you trust this code: [Yes/No]
- Would you use it as-is: [Yes/No]
- Required fixes:
  1. 
  2. 

### Comparison to Manual Coding:
- Estimated time to code manually: ___ hours
- Estimated time with AI: ___ minutes
- Worth it: [Yes/No - Why?]
```

---

### **Day 7: System Integration & Workflows (2.5 hours)**

#### **Task 3.3: Complete End-to-End Workflow (1.5 hours)**

**Goal:** Test the complete researcher workflow.

**Scenario:** You're a researcher running a study.

**Complete Workflow:**

1. **Plan your study:**
   - Choose experiment: [Your choice]
   - Number of participants: 10
   - Configuration: [Decide parameters]

2. **Set up experiment:**
   - Log in as experimenter
   - Configure experiment
   - Generate participant link
   - Test the link yourself

3. **Collect data:**
   - Use 10 different "participants" (incognito windows)
   - Use different subject IDs (STUDY_P01 through STUDY_P10)
   - Complete each session
   - Document any issues

4. **Download data:**
   - Export all 10 sessions
   - Combine into one dataset (if needed)
   - Open in Excel or similar

5. **Analyze data:**
   - Calculate mean accuracy
   - Calculate mean reaction time
   - Identify any outliers

**Document Every Step:**
```markdown
## Complete Workflow Test

### Planning (5 min):
- Clear what needed: [Yes/No]
- Easy to make decisions: [Yes/No]

### Setup (10 min):
- Easy to configure: [Yes/No]
- Time taken: ___ minutes
- Issues: [List]

### Data Collection (60 min):
- Sessions completed: ___/10
- Time per session: ___ minutes average
- Dropout issues: [Any?]
- Technical issues: [Any?]

### Data Export (5 min):
- Easy to find data: [Yes/No]
- Export worked first try: [Yes/No]
- Issues: [List]

### Data Analysis (10 min):
- Could open data: [Yes/No]
- Data format usable: [Yes/No]
- Could calculate stats: [Yes/No]
- Issues: [List]

### Results:
- Mean accuracy: ___%
- Mean RT: ___ ms
- Data quality: [Good/Fair/Poor]

### Overall Workflow Rating: ___/10

### Biggest Problems:
1. 
2. 
3. 

### Biggest Strengths:
1. 
2. 
3. 

### Would you use this for real research?
[Yes/No/Maybe - Why?]
```

---

#### **Task 3.4: Stress Testing (1 hour)**

**Goal:** Push the system to its limits.

**Tests:**

1. **Many sessions:**
   - Create 20+ sessions rapidly
   - Document: Does system slow down?

2. **Long sessions:**
   - Configure an experiment with 100+ trials
   - Complete it
   - Document: Any performance issues?

3. **Rapid responses:**
   - Complete an experiment responding as fast as possible
   - Document: Does timing work correctly?

4. **Concurrent users:**
   - Open 5 browser windows
   - Run experiments simultaneously
   - Document: Any conflicts or issues?

**Document:**
```markdown
## Stress Testing Results

### Many Sessions Test:
- Sessions created: ___
- System performance: [Good/Degraded/Crashed]
- Issues: [List]

### Long Session Test:
- Trials completed: ___
- Time taken: ___ minutes
- Issues: [List]

### Rapid Response Test:
- Minimum RT recorded: ___ ms
- Data looks valid: [Yes/No]
- Issues: [List]

### Concurrent Users Test:
- Simultaneous experiments: ___
- All completed: [Yes/No]
- Data integrity: [Good/Issues]
- Issues: [List]

### System Limits Found:
1. 
2. 
3. 

### Recommendations:
- Maximum recommended users: ___
- Maximum recommended trials: ___
- Required improvements:
  1. 
  2. 
```

---

### **Days 8-9: Final Report & Recommendations (2.5 hours)**

#### **Task 3.5: Compile Comprehensive Test Report (2 hours)**

**Goal:** Create final comprehensive report.

**Report Structure:**

```markdown
# Experiment Maker Platform - Final Testing Report

**Tester:** [Your name]
**Testing Period:** [Dates]
**Total Hours:** 24 hours over 3 weeks
**Date:** [Today]

---

## EXECUTIVE SUMMARY

### Overall Assessment:
[2-3 paragraphs summarizing your overall impression]

### Readiness for Deployment:
- Ready for students: [Yes/No/With fixes]
- Ready for research: [Yes/No/With fixes]
- Confidence level: [1-10]

### Critical Issues Found: [Number]
### Major Issues Found: [Number]
### Minor Issues Found: [Number]

---

## 1. SETUP & INSTALLATION

### Experience:
[Your setup experience]

### Issues:
1. [Critical issues with setup]
2. 
3. 

### Recommendations:
1. 
2. 

---

## 2. USER EXPERIENCE - PARTICIPANTS

### Testing Summary:
- Experiments tested: [Number]
- Sessions completed: [Number]
- Average time per session: [Minutes]

### Strengths:
1. 
2. 
3. 

### Issues Found:
#### Critical (Breaks functionality):
1. 
2. 

#### Major (Significant UX problems):
1. 
2. 

#### Minor (Annoying but workable):
1. 
2. 

### Recommendations:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

---

## 3. USER EXPERIENCE - EXPERIMENTERS

### Testing Summary:
- Experiments configured: [Number]
- Sessions managed: [Number]
- Data exports performed: [Number]

### Strengths:
1. 
2. 
3. 

### Issues Found:
[Same categories as above]

### Recommendations:
[Prioritized list]

---

## 4. TECHNICAL TESTING

### Browser Compatibility:
[Summary table from Week 2]

### Mobile/Responsive:
[Summary of mobile testing]

### Performance:
[Summary of stress testing]

### Data Integrity:
[Summary of data testing]

---

## 5. SECURITY & RELIABILITY

### Security Testing:
- Authentication: [Assessment]
- Data protection: [Assessment]
- Input validation: [Assessment]

### Issues Found:
[List security concerns]

### Reliability:
- Crash frequency: [Assessment]
- Data loss incidents: [Number]
- Error handling: [Assessment]

---

## 6. DOCUMENTATION QUALITY

### Setup Guide: ___/10
### User Instructions: ___/10
### Error Messages: ___/10
### Help Resources: ___/10

### Issues:
1. 
2. 

### Recommendations:
1. 
2. 

---

## 7. AI GENERATION FEATURE

### Usability: ___/10
### Code Quality: ___/10
### Documentation: ___/10

### Strengths:
1. 
2. 

### Issues:
1. 
2. 

### Recommendations:
1. 
2. 

---

## 8. COMPLETE BUG LIST

### Critical Bugs (Must fix before deployment):
| ID | Bug Description | Steps to Reproduce | Impact |
|----|----------------|-------------------|--------|
| C1 | | | |
| C2 | | | |

### Major Bugs (Should fix soon):
| ID | Bug Description | Steps to Reproduce | Impact |
|----|----------------|-------------------|--------|
| M1 | | | |

### Minor Bugs (Fix when convenient):
| ID | Bug Description | Steps to Reproduce | Impact |
|----|----------------|-------------------|--------|
| m1 | | | |

---

## 9. FEATURE REQUESTS

### High Priority:
1. [Feature] - [Why needed]
2. 
3. 

### Medium Priority:
1. 
2. 

### Low Priority (Nice to have):
1. 
2. 

---

## 10. COMPARATIVE ANALYSIS

### Best Practices Seen:
1. 
2. 
3. 

### Worst Practices Seen:
1. 
2. 
3. 

### Industry Standards:
How does this compare to:
- Pavlovia: [Better/Same/Worse - Why]
- Qualtrics: [Better/Same/Worse - Why]
- PsychoPy: [Better/Same/Worse - Why]

---

## 11. RECOMMENDATIONS

### Immediate (Before any deployment):
1. [Must fix]
2. [Must fix]
3. [Must fix]

### Short-term (First month):
1. [Should fix]
2. [Should fix]

### Long-term (Nice to have):
1. 
2. 

---

## 12. DEPLOYMENT READINESS

### For Student Testing:
- Ready: [Yes/No]
- Required fixes: [List or "None"]
- Timeline estimate: [Days/Weeks]

### For Research Use:
- Ready: [Yes/No]
- Required fixes: [List]
- Timeline estimate: [Weeks/Months]

### Risk Assessment:
- Data loss risk: [Low/Medium/High]
- Security risk: [Low/Medium/High]
- Usability issues: [Low/Medium/High]

---

## 13. PERSONAL REFLECTION

### What worked well:
[Your thoughts on the testing process]

### What was difficult:
[Challenges you faced]

### Skills learned:
1. 
2. 
3. 

### Would you recommend this for research:
[Yes/No - Detailed reasoning]

---

## APPENDICES

### Appendix A: Raw Test Data
[Link to or attach your exported CSV files]

### Appendix B: Screenshots
[Key screenshots of bugs/issues]

### Appendix C: Testing Logs
[Detailed logs if you kept them]

---

## CONCLUSION

[Final paragraph summarizing your recommendation]

---

**Report prepared by:** [Your name]
**Date:** [Today]
**Contact:** [Your email]
```

---

#### **Task 3.6: Create Presentation (30 min)**

**Goal:** Create a brief presentation of findings.

**Create a 10-slide presentation:**

1. **Title slide**
2. **Executive summary**
3. **Testing methodology**
4. **Critical bugs found** (with screenshots)
5. **Major UX issues**
6. **Data quality assessment**
7. **Security & reliability**
8. **Top 5 recommendations**
9. **Deployment readiness**
10. **Conclusion**

**Tools:** PowerPoint, Google Slides, Keynote, or similar

---

### **Week 3 Deliverable:**

**Due: End of Week 3**

Submit:
1. **Complete final report** (using template above)
2. **Presentation slides** (10 slides)
3. **All exported data files** (ZIP them)
4. **Screenshots of major bugs** (organized folder)
5. **Week 3 summary**

**Format:** PDF report + PPTX/PDF slides + ZIP of data/screenshots  
**Filename:** `Week3_Final_Report_YourName.pdf`

---

## 📊 GRADING RUBRIC

### Week 1 (30%):
- Setup & navigation testing (10%)
- Login system testing (5%)
- All experiments completed and documented (10%)
- Quality of documentation (5%)

### Week 2 (35%):
- Experimenter features tested (10%)
- Data export testing (10%)
- Edge case testing (5%)
- Browser/device compatibility (5%)
- Quality of documentation (5%)

### Week 3 (35%):
- AI generation testing (5%)
- End-to-end workflow testing (10%)
- Stress testing (5%)
- Final report completeness (10%)
- Presentation quality (5%)

### Overall:
- **A (90-100%):** Thorough testing, excellent documentation, actionable recommendations
- **B (80-89%):** Complete testing, good documentation, useful feedback
- **C (70-79%):** Basic testing complete, adequate documentation
- **D (<70%):** Incomplete testing or poor documentation

---

## 💡 TIPS FOR SUCCESS

### Do:
✅ Test everything thoroughly, not just happy paths
✅ Document as you go, don't wait until end
✅ Take screenshots of bugs
✅ Try to break things on purpose
✅ Think like a real user
✅ Be honest in your assessment
✅ Suggest concrete improvements
✅ Ask questions if confused

### Don't:
❌ Rush through tests
❌ Only test once
❌ Skip documentation
❌ Only report "it works" or "it's broken"
❌ Wait until the last minute
❌ Just list bugs without context
❌ Forget to back up your work

---

## 🆘 GETTING HELP

**If you're stuck:**
1. Check `docs/SETUP_GUIDE_FIXED_VERSION.md`
2. Check `docs/FIXES_SUMMARY.md`
3. Google the error message
4. Ask your instructor
5. Email your instructor with:
   - What you were trying to do
   - What you expected
   - What happened instead
   - Screenshots if relevant

**Office hours:** [Your instructor will specify]

---

## ✅ CHECKLIST

### Before Starting:
- [ ] Have the ZIP file
- [ ] Have Python 3.8+ installed
- [ ] Have a text editor
- [ ] Have Claude.ai OR ChatGPT account (free)
- [ ] Have way to take screenshots
- [ ] Have spreadsheet software (Excel, Google Sheets)
- [ ] Understand the time commitment (8 hrs/week)

### After Week 1:
- [ ] Setup completed and documented
- [ ] All 3 experiments tested as participant
- [ ] Login system tested
- [ ] Week 1 report submitted

### After Week 2:
- [ ] Experimenter features tested
- [ ] Data export tested
- [ ] Edge cases tested
- [ ] Multiple browsers tested
- [ ] Week 2 report submitted

### After Week 3:
- [ ] AI generation tested
- [ ] Complete workflow tested
- [ ] Stress testing done
- [ ] Final report written
- [ ] Presentation created
- [ ] All deliverables submitted

---

## 🎉 YOU'RE READY!

**This is comprehensive, systematic testing.**

**Your work will:**
- Find bugs before real users do
- Improve the system significantly
- Help researchers collect better data
- Make you a better tester
- Look great on your resume

**Thank you for your thorough testing!** 🚀

**Questions? Ask your instructor before you start.**

**Good luck!**
