# 🎓 Undergraduate Student Guide
## Experiment Maker Platform - Getting Started & Testing Tasks

**Version 1.0 - For Undergraduate Students**

---

## 📚 WHAT IS THIS?

This is a web-based platform for creating and running cognitive psychology experiments. You'll be testing it out and helping us improve it before we deploy it for real research.

**Your mission:**
1. Learn how the platform works
2. Test all the features
3. Report what works and what doesn't
4. Suggest improvements

---

## 🚀 PART 1: GETTING STARTED (15 minutes)

### **Step 1: Get the Files**

Your instructor should have given you a ZIP file: `experiment_maker_redesign.zip`

**On Mac:**
1. Find the ZIP in your Downloads folder
2. Double-click it → It extracts automatically
3. You'll see a folder called `experiment_maker_redesign`
4. Open that folder

**On Windows:**
1. Find the ZIP in your Downloads folder
2. Right-click → Extract All
3. Choose where to extract (Desktop is fine)
4. Open the `experiment_maker_redesign` folder

**On Linux:**
1. Navigate to Downloads: `cd ~/Downloads`
2. Extract: `unzip experiment_maker_redesign.zip`
3. Enter folder: `cd experiment_maker_redesign`

---

### **Step 2: Open the Platform**

**Find the file called:** `INDEX.html`

**Open it:**
- **Mac:** Double-click INDEX.html (opens in Safari)
- **Windows:** Double-click INDEX.html (opens in Edge or Chrome)
- **Linux:** Right-click → Open With → Firefox/Chrome

**You should see:**
- A welcome page with "Experiment Maker" at the top
- 4 big cards showing different options
- Some information about how data works
- A FAQ section

**✅ If you see this, you're ready!**

**❌ If you see weird code or errors:**
- Make sure you opened INDEX.html (not a different file)
- Try a different browser (Chrome works best)
- Ask your instructor for help

---

### **Step 3: Look Around (5 minutes)**

**Task:** Just click around and explore. Don't worry about breaking anything!

**Try clicking:**
- Each of the 4 main cards
- The FAQ questions (they expand when you click)
- The "Back to Home" links
- Any buttons you see

**Write down:**
- What looks confusing?
- What's interesting?
- Any questions you have?

---

## 🧪 PART 2: TESTING TASKS (2-3 hours total)

You'll complete 5 testing tasks. Each tests a different part of the platform.

---

## 📋 TASK 1: Test a Pre-Made Experiment (30 minutes)

**Goal:** Experience what a participant would experience.

### **Instructions:**

1. **Go back to INDEX.html** (the home page)

2. **Scroll down to "Pre-Made Experiments"**

3. **Click on the "Digit Span" card**

4. **Try to complete the experiment:**
   - Read the instructions
   - Try a few practice trials
   - See how it works
   - Note: This is a DEMO so it won't actually save real data yet

### **What to Document:**

**In your testing report, answer:**

1. **User Experience:**
   - Were the instructions clear?
   - Could you figure out what to do?
   - Did the experiment work smoothly?
   - Any confusing parts?

2. **Technical Issues:**
   - Did anything break?
   - Any error messages?
   - Did buttons work?
   - Did trials display correctly?

3. **Suggestions:**
   - What would make it better?
   - What's missing?
   - What did you like?

### **Testing Checklist:**

- [ ] Opened the Digit Span experiment
- [ ] Read instructions
- [ ] Completed at least 5 trials
- [ ] Tested with correct and incorrect responses
- [ ] Noted reaction time (if shown)
- [ ] Reached the end or debriefing screen
- [ ] Documented your experience

**Repeat with at least ONE other pre-made experiment:**
- [ ] Stroop Task
- [ ] SART
- [ ] IAT Demo

---

## 🧠 TASK 2: Create a Custom IAT (45 minutes)

**Goal:** Test the IAT Customization Wizard.

### **Instructions:**

1. **Go back to INDEX.html**

2. **Click the "Customize an IAT" card**
   - This should open `IAT_WIZARD.html`

3. **Follow the wizard to create your own IAT:**

   **Scenario:** You're studying attitudes toward coffee vs. tea
   
   - **Step 1:** Choose "Custom IAT"
   - **Step 2:** Define categories:
     - Target A: "Coffee"
     - Target B: "Tea"  
     - Attribute A: "Energizing"
     - Attribute B: "Relaxing"
   
   - **Step 3:** Add stimuli:
     - Coffee items: espresso, cappuccino, latte, americano, mocha, cold brew, french press, drip coffee, flat white, macchiato
     - Tea items: green tea, black tea, chamomile, earl grey, oolong, jasmine, matcha, rooibos, peppermint, pu-erh
     - Energizing: active, alert, focused, motivated, powerful, strong, dynamic, vigorous, lively, stimulated
     - Relaxing: calm, peaceful, serene, gentle, soothing, tranquil, restful, mellow, comfortable, easygoing
   
   - **Step 4:** Keep default parameters (or experiment with them)
   
   - **Step 5:** Preview a few trials
   
   - **Step 6:** Try to generate the IAT

### **What to Document:**

1. **Wizard Experience:**
   - Was each step clear?
   - Did the hints help?
   - Did the FAQs answer your questions?
   - Could you complete all 6 steps?

2. **Validation:**
   - Did the stimulus validator give you feedback?
   - Were warnings helpful?
   - Did it catch any mistakes?

3. **Preview:**
   - Did preview trials work?
   - Could you tell which key to press?
   - Were the categories clear?

4. **Problems:**
   - What was confusing?
   - What didn't work?
   - What would you change?

### **Testing Checklist:**

- [ ] Completed all 6 wizard steps
- [ ] Added at least 10 items per category
- [ ] Read and understood the hints
- [ ] Checked at least one FAQ
- [ ] Previewed some trials
- [ ] Noted any validation warnings
- [ ] Tried to generate the final IAT
- [ ] Documented your experience

### **Extra Credit:**

Try creating IATs for these scenarios:
- [ ] Political attitudes (Democrats vs. Republicans)
- [ ] Food preferences (Healthy vs. Junk Food)
- [ ] Gender stereotypes (your own categories)

Document which one was easiest/hardest to create.

---

## 🤖 TASK 3: Generate an Experiment with AI (60 minutes)

**Goal:** Test the AI-to-Platform workflow.

### **Prerequisites:**

You need access to either:
- Claude.ai (free account)
- ChatGPT (free account)

### **Instructions:**

1. **Download the AI prompt template:**
   - Go back to INDEX.html
   - Click "Create New Experiment"
   - Click "Download Prompt Template" button
   - This downloads: `AI_PROMPT_COPY_PASTE.txt`

2. **Open the template in a text editor**
   - Mac: TextEdit
   - Windows: Notepad
   - Linux: gedit

3. **Read through the template** (5 minutes)
   - Notice it has detailed specifications
   - Find Section 8: "MY EXPERIMENT SPECIFICATION"
   - This is where you describe YOUR experiment

4. **Choose an experiment to create:**

   **Option A - Simple:** Recognition Memory Test
   ```
   Participants see 15 words for 2 seconds each.
   After a 10-second delay, they see 30 words (15 old, 15 new).
   For each word, they press Y if they saw it before, N if new.
   Record reaction times and accuracy.
   ```

   **Option B - Medium:** Visual Search Task
   ```
   Display 12 shapes on screen (circles and squares).
   One shape is red, others are blue.
   Participant clicks the red shape as fast as possible.
   Record reaction time.
   Do 20 trials.
   ```

   **Option C - Complex:** N-Back Task
   ```
   Show letters one at a time for 500ms each.
   Participant presses spacebar if current letter matches 
   the letter from 2 trials ago (2-back).
   Do 50 trials with 30% targets.
   Record accuracy and reaction times.
   ```

5. **Fill in Section 8 of the template:**
   - Experiment Type: [Your choice]
   - Detailed Description: [What happens step by step]
   - Stimuli: [What participants see]
   - Trial Structure: [Timing, responses]
   - Specific Requirements: [Any special needs]

6. **Copy the ENTIRE template** (all of it, not just Section 8)

7. **Go to Claude.ai or ChatGPT**

8. **Paste the entire template and hit enter**

9. **Wait for the AI to generate the code** (30-60 seconds)

10. **Copy ALL the generated code**

11. **Go back to the platform:**
    - Click "Create New Experiment"
    - Find the big text box
    - Paste the code

12. **Click "Validate Code Quality"**
    - Read the validation report
    - Check the score (0-100)
    - Note any errors or warnings

13. **If there are errors:**
    - Go back to the AI
    - Say: "Please fix these errors: [paste the errors]"
    - Get updated code
    - Paste again
    - Validate again

14. **When validation passes (score > 70):**
    - Click "Convert & Preview" (if available)
    - Or just note that validation passed

### **What to Document:**

1. **Prompt Quality:**
   - Was the template easy to understand?
   - Did you know what to fill in Section 8?
   - Was anything confusing?

2. **AI Performance:**
   - Did the AI understand the template?
   - Did it generate valid code?
   - Did it follow the specifications?
   - How long did it take?

3. **Validation Results:**
   - What was your initial score?
   - What errors/warnings did you get?
   - Did fixing them work?
   - Final score?

4. **Overall Experience:**
   - Could you complete the task?
   - What was hardest?
   - What would make it easier?

### **Testing Checklist:**

- [ ] Downloaded AI prompt template
- [ ] Read and understood the template
- [ ] Filled in Section 8 with experiment details
- [ ] Copied ENTIRE template to AI
- [ ] AI generated code
- [ ] Pasted code into platform
- [ ] Ran validator
- [ ] Got a validation score
- [ ] Fixed any errors (if needed)
- [ ] Achieved score > 70
- [ ] Documented your experience

### **Common Problems & Solutions:**

**Problem:** "AI didn't follow the template"
→ Make sure you pasted the ENTIRE template, not just Section 8

**Problem:** "Validator shows lots of errors"
→ Go back to AI and say "Please fix these errors" with the error list

**Problem:** "AI code doesn't include EXPERIMENT_CONFIG"
→ You probably used a simple prompt, not the template. Use the full template!

**Problem:** "Don't have Claude.ai or ChatGPT access"
→ Ask a classmate to help, or ask instructor for alternative

---

## 🔍 TASK 4: Test the Validator (30 minutes)

**Goal:** Understand what makes good vs. bad experiment code.

### **Instructions:**

We'll give you three code samples to test. Copy each one, paste it into the creator, and validate it.

#### **Sample 1: Perfect Code**

```html
<!DOCTYPE html>
<html>
<head><title>Perfect Experiment</title></head>
<body>
<script>
const EXPERIMENT_CONFIG = {
    metadata: {name: "Test", version: "1.0", description: "Good experiment"},
    stimuli: [{id: "s1", type: "text", content: "apple", category: "fruit"}],
    trials: {practiceTrials: 5, experimentTrials: 20, presentationTime: 2000, isi: 500},
    instructions: {welcome: "Welcome", practice: "Practice", experiment: "Main", debrief: "Thanks"},
    responses: {type: "keyboard", keys: {"y": "yes", "n": "no"}}
};

const EXPERIMENT_DATA = {
    sessionInfo: {startTime: null},
    trials: [],
    summary: {}
};

function initExperiment() {
    EXPERIMENT_DATA.sessionInfo.startTime = Date.now();
}

function runTrial(stimulus) {
    const start = performance.now();
    const rt = performance.now() - start;
    EXPERIMENT_DATA.trials.push({
        trialNumber: 1,
        stimulusId: stimulus.id,
        response: "y",
        responseTime: rt,
        correct: true,
        timestamp: Date.now()
    });
}

function calculateResults() {
    // Calculate summary
}

function getExperimentData() {
    return JSON.stringify(EXPERIMENT_DATA);
}
</script>
</body>
</html>
```

**Expected:** High score (90-100), no errors

---

#### **Sample 2: Missing Required Objects**

```html
<html>
<body>
<script>
var myExperiment = {
    name: "Test"
};

function runExperiment() {
    alert("Hello!");
}
</script>
</body>
</html>
```

**Expected:** Many errors about missing EXPERIMENT_CONFIG and EXPERIMENT_DATA

---

#### **Sample 3: Has Objects But Missing Functions**

```html
<!DOCTYPE html>
<html>
<body>
<script>
const EXPERIMENT_CONFIG = {
    metadata: {name: "Test"},
    stimuli: [],
    trials: {},
    instructions: {},
    responses: {}
};

const EXPERIMENT_DATA = {
    sessionInfo: {},
    trials: [],
    summary: {}
};

// Functions missing!
</script>
</body>
</html>
```

**Expected:** Has structure but missing functions, medium score

---

### **What to Document:**

For each sample, record:

1. **Validation Score:** (0-100)
2. **Number of Errors:** 
3. **Number of Warnings:**
4. **Number of Suggestions:**
5. **Most Useful Feedback:** What was most helpful?
6. **Did the validator help you understand the problem?**

### **Testing Checklist:**

- [ ] Tested Sample 1 (perfect code)
- [ ] Tested Sample 2 (bad code)
- [ ] Tested Sample 3 (incomplete code)
- [ ] Compared the validation reports
- [ ] Understood why each got its score
- [ ] Can explain what makes good experiment code

---

## 💻 TASK 5: Test Offline Mode (30 minutes)

**Goal:** Make sure experiments can run without internet.

**Note:** The offline mode generator is built (backend code exists) but may not have a "Download Offline" button in the demos yet. This task tests whether you can understand how it WOULD work.

### **Instructions:**

1. **Find any pre-made experiment** (Digit Span, Stroop, etc.)

2. **Look for a "Download Offline Version" button**
   - It might be in the configuration screen
   - Or it might not be implemented yet in the demos

3. **If the button exists:**
   - Click it
   - Download the standalone HTML file
   - Open the downloaded file
   - Try running the experiment
   - See if data export works

4. **If the button doesn't exist:**
   - Read the documentation about offline mode
   - Look at `backend/offline_generator.py` in the files
   - Read the code comments
   - Answer the questions below based on understanding

### **What to Document:**

**If offline mode button exists:**
1. Did the download work?
2. Did the file open correctly?
3. Could you run the experiment?
4. Did data save?
5. Could you export data?
6. What format was the export? (CSV, JSON?)

**If offline mode button doesn't exist yet:**
1. Did you find the offline_generator.py file?
2. Can you understand from reading it how offline mode would work?
3. What would be the benefits of offline mode?
4. What use cases would benefit from it?

**For everyone:**
5. Why would a researcher want offline mode?
6. How is it different from the online mode?
7. What are the trade-offs?

### **Testing Checklist:**

- [ ] Looked for offline mode option
- [ ] Documented whether it exists in demos
- [ ] If exists: tested downloading and running
- [ ] If not: read offline_generator.py code
- [ ] Understood the purpose of offline mode
- [ ] Identified use cases
- [ ] Documented findings

---

## 📝 PART 3: FINAL REPORT (30 minutes)

After completing all tasks, write up your findings.

### **Report Template:**

```
EXPERIMENT MAKER PLATFORM - TESTING REPORT

Your Name: _______________
Date: _______________
Browser Used: _______________
Operating System: _______________

---

TASK 1: PRE-MADE EXPERIMENTS

Experiments Tested: 
- [ ] Digit Span
- [ ] Stroop
- [ ] SART  
- [ ] IAT Demo

Overall Experience (1-5): ___/5

What Worked Well:
- 
- 
- 

Problems Found:
- 
- 
- 

Suggestions:
- 
- 
- 

---

TASK 2: IAT WIZARD

Completed All Steps: [ ] Yes [ ] No

If no, stopped at step: ___

Overall Experience (1-5): ___/5

What Worked Well:
- 
- 
- 

Problems Found:
- 
- 
- 

Were the hints helpful? [ ] Yes [ ] No
Were the FAQs helpful? [ ] Yes [ ] No

Suggestions:
- 
- 
- 

---

TASK 3: AI GENERATION

AI Used: [ ] Claude [ ] ChatGPT [ ] Other: ___

Experiment Created: _______________

Validation Score (first attempt): ___/100
Validation Score (final): ___/100

Did the template help? [ ] Yes [ ] No

What Worked Well:
- 
- 
- 

Problems Found:
- 
- 
- 

Suggestions:
- 
- 
- 

---

TASK 4: VALIDATOR TESTING

Sample 1 Score: ___/100
Sample 2 Score: ___/100
Sample 3 Score: ___/100

Did the validator help you understand code quality? [ ] Yes [ ] No

Most useful validation feature:
- 

Suggestions:
- 
- 
- 

---

TASK 5: OFFLINE MODE

Feature Available: [ ] Yes [ ] No

If yes, did it work? [ ] Yes [ ] No

Understood the purpose? [ ] Yes [ ] No

Suggestions:
- 
- 
- 

---

OVERALL ASSESSMENT

Overall Platform Rating (1-5): ___/5

Top 3 Strengths:
1. 
2. 
3. 

Top 3 Problems:
1. 
2. 
3. 

Top 3 Suggestions:
1. 
2. 
3. 

Would you use this for research? [ ] Yes [ ] No [ ] Maybe

Why or why not?


Additional Comments:



```

---

## 🎯 EVALUATION CRITERIA

Your instructor will evaluate based on:

**Completeness (40%):**
- [ ] Completed all 5 tasks
- [ ] Documented everything requested
- [ ] Filled out complete report

**Quality of Testing (30%):**
- [ ] Actually tried the features thoroughly
- [ ] Found real problems (not just cosmetic)
- [ ] Tested edge cases
- [ ] Tried to break things

**Quality of Feedback (20%):**
- [ ] Specific problems identified
- [ ] Constructive suggestions
- [ ] Explained WHY things are problems
- [ ] Suggested realistic solutions

**Understanding (10%):**
- [ ] Showed understanding of platform purpose
- [ ] Understood workflow for each task
- [ ] Identified use cases correctly
- [ ] Asked good questions

---

## 💡 TIPS FOR GOOD TESTING

### **DO:**
✅ Actually use the features (don't just look at them)
✅ Try to break things on purpose
✅ Test with realistic data
✅ Note small issues (they add up!)
✅ Explain WHY something is a problem
✅ Suggest specific improvements
✅ Take screenshots of errors
✅ Ask questions if confused

### **DON'T:**
❌ Just click through quickly
❌ Only report "it's fine"
❌ Ignore small bugs
❌ Say "it's bad" without explaining why
❌ Give vague feedback like "make it better"
❌ Skip tasks because they seem boring
❌ Test in a rush

---

## 🆘 GETTING HELP

**If you're stuck:**

1. **Check the FAQ** on the homepage
2. **Read the STUDENT_GUIDE.md** (this file!)
3. **Look in the documentation folder** for more guides
4. **Ask a classmate** - they might have figured it out
5. **Ask your instructor** - that's what they're here for!

**If you find a bug:**

1. **Note exactly what you did** (step-by-step)
2. **Note what you expected** to happen
3. **Note what actually happened**
4. **Take a screenshot** if possible
5. **Write it in your report**

**If something is confusing:**

That's valuable feedback! Write down:
- What confused you?
- What would have made it clearer?
- What did you expect to see instead?

---

## 🎓 LEARNING OBJECTIVES

By completing these tasks, you will:

✅ Understand how cognitive psychology experiments work
✅ Learn what makes good experiment design
✅ Experience being both experimenter and participant
✅ Practice using AI tools for practical tasks
✅ Develop software testing skills
✅ Learn to give constructive feedback
✅ Understand research methods better

---

## 📅 TIMELINE SUGGESTION

**Week 1:**
- Get files, open platform, explore (30 min)
- Complete Task 1 (30 min)
- Complete Task 2 (45 min)

**Week 2:**
- Complete Task 3 (60 min)
- Complete Task 4 (30 min)
- Complete Task 5 (30 min)

**Week 3:**
- Write final report (30 min)
- Review and submit

**Total time:** ~4 hours across 3 weeks

---

## ✅ SUBMISSION CHECKLIST

Before you submit, make sure you have:

- [ ] Completed all 5 tasks
- [ ] Filled out the complete report template
- [ ] Included specific examples
- [ ] Noted any bugs found
- [ ] Made constructive suggestions
- [ ] Proofread your report
- [ ] Saved screenshots (if applicable)
- [ ] Named your file: LastName_FirstName_ExperimentMaker_Report.pdf

---

## 🎉 BONUS CHALLENGES (Optional)

If you finish early or want extra credit:

**Challenge 1:** Create TWO different experiments with AI
- Compare how well the AI understood each
- Which was easier to create?
- Document differences

**Challenge 2:** Design your own experiment
- Think of something you'd want to test
- Use the platform to create it
- Does it work for your idea?

**Challenge 3:** Test on a friend
- Have someone else try the platform
- Watch them (don't help!)
- Note where they get confused
- Write up their experience

**Challenge 4:** Explore the code
- Look at the backend Python files
- Look at the HTML/JavaScript
- Can you understand how it works?
- Could you fix a bug?

---

## 📚 ADDITIONAL RESOURCES

**In the package:**
- README.md - Package overview
- STUDENT_GUIDE.md - This file
- CRITICAL_GAPS_FIXED.md - What's been built
- USER_JOURNEY_ANALYSIS.md - How users should flow through

**Online Resources:**
- Cognitive psychology experiments: https://pavlovia.org
- IAT information: https://implicit.harvard.edu
- JavaScript basics: https://javascript.info
- Research methods: Your textbook!

---

**Good luck with your testing! Your feedback will help make this platform better for real research.** 🚀

**Questions? Ask your instructor!**
