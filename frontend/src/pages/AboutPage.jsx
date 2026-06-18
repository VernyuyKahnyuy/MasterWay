import { Link } from "react-router-dom";

const CYAN = "#00C8FF";
const CYAN_TEXT = "var(--cyber-text)";

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p
        className="text-4xl font-bold mb-1"
        style={{
          color: CYAN,
          fontFamily: "'Rajdhani', sans-serif",
          textShadow: "0 0 20px rgba(0,200,255,0.4)",
        }}
      >
        {value}
      </p>
      <p
        className="text-sm text-gray-400"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </p>
    </div>
  );
}

function ScienceCard({ icon, title, children }) {
  return (
    <div
      className="rounded-2xl p-6 border"
      style={{
        background: "rgba(0,200,255,0.04)",
        borderColor: "rgba(0,200,255,0.18)",
      }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3
        className="text-lg font-bold mb-3"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.04em",
          color: CYAN_TEXT,
        }}
      >
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(0,200,255,0.06) 0%, transparent 60%), #0a0a14",
      }}
    >
      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <p
          className="text-xs tracking-widest mb-4 uppercase"
          style={{
            color: "rgba(0,200,255,0.6)",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          // the science behind masterway
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.04em",
            color: "white",
          }}
        >
          Learning is a habit.
          <br />
          <span
            style={{ color: CYAN, textShadow: "0 0 30px rgba(0,200,255,0.5)" }}
          >
            Science proves it.
          </span>
        </h1>
        <p
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          MasterWay is built on decades of cognitive science and behavioural
          psychology research. Every feature streaks, progress bars,
          accountability feeds is deliberately engineered to rewire your brain
          for consistent learning.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-lg transition-all hover:opacity-90"
          style={{
            background: CYAN,
            color: "white",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.08em",
            boxShadow: "0 0 20px rgba(0,200,255,0.4)",
          }}
        >
          START LEARNING →
        </Link>
      </section>

      {/* ── Impact Stats ── */}
      <section
        className="py-12 border-y"
        style={{
          borderColor: "rgba(0,200,255,0.15)",
          background: "rgba(0,200,255,0.03)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value="10×" label="higher retention with daily streaks" />
          <Stat
            value="89%"
            label="of Duolingo's most active users use streak freeze"
          />
          <Stat
            value="34%"
            label="more lessons completed with progress bars (MIT, 2011)"
          />
          <Stat
            value="3×"
            label="more likely to finish when peers can see your progress"
          />
        </div>
      </section>

      {/* ── Streaks Section ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="text-xs tracking-widest mb-3 uppercase"
              style={{
                color: "rgba(0,200,255,0.6)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              01 / streaks
            </p>
            <h2
              className="text-4xl font-bold text-white mb-5"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Why streaks work
            </h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                In 2011, Duolingo introduced a deceptively simple feature: a
                counter that tracked how many consecutive days a user had
                practiced. The result was staggering users with a 7-day streak
                were{" "}
                <strong className="text-white">ten times more likely</strong> to
                still be using the app 6 months later.
              </p>
              <p>
                The science behind this is rooted in{" "}
                <strong className="text-white">loss aversion</strong>, first
                described by Kahneman &amp; Tversky. The psychological pain of
                losing a streak is roughly{" "}
                <strong className="text-white">twice as powerful</strong> as the
                pleasure of gaining one your brain fights to protect what it has
                built.
              </p>
              <p>
                This is also why Charles Duhigg's framework in{" "}
                <em>The Power of Habit</em> places so much emphasis on the
                "streak" as a commitment device. Every day you continue, the
                habit loop strengthens:{" "}
                <span style={{ color: CYAN }}>cue → routine → reward</span>. The
                streak counter IS the reward.
              </p>
              <p>
                B.J. Fogg at Stanford's Persuasive Technology Lab found that
                tiny, measurable wins compound over time. A 1% improvement each
                day leads to a{" "}
                <strong className="text-white">37× better outcome</strong> over
                a year.
              </p>
            </div>
          </div>
          <div
            className="rounded-2xl p-8 text-center border"
            style={{
              background: "rgba(0,200,255,0.05)",
              borderColor: "rgba(0,200,255,0.2)",
            }}
          >
            <div className="text-8xl mb-4">🔥</div>
            <p
              className="text-6xl font-bold mb-2"
              style={{ fontFamily: "'Rajdhani', sans-serif", color: CYAN }}
            >
              Streak
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Your daily streak on MasterWay counts every lesson you complete or
              update you post. Miss a day and your brain will notice.
            </p>
            <div
              className="rounded-xl p-4 text-left text-xs"
              style={{
                background: "rgba(0,0,0,0.3)",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(0,200,255,0.7)",
              }}
            >
              <p>{">"} streak_day_1 = lesson_complete()</p>
              <p>{">"} streak_day_2 = lesson_complete()</p>
              <p>{">"} streak_day_7 = habit_formed() ✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Progress Feedback Section ── */}
      <section
        className="py-20 border-y"
        style={{
          borderColor: "rgba(0,200,255,0.12)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div className="px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div
            className="rounded-2xl p-8 border order-2 md:order-1"
            style={{
              background: "rgba(0,200,255,0.05)",
              borderColor: "rgba(0,200,255,0.2)",
            }}
          >
            <p
              className="text-xs mb-3"
              style={{
                color: "rgba(0,200,255,0.6)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              progress_bar.render()
            </p>
            <div className="space-y-4">
              {[
                { label: "Neural Networks", pct: 72 },
                { label: "Python Basics", pct: 100 },
                { label: "Data Structures", pct: 45 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-300">{label}</span>
                    <span style={{ color: CYAN }}>{pct}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{ background: "rgba(0,200,255,0.12)" }}
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct === 100
                            ? "linear-gradient(90deg, #00C8FF, #00FFB2)"
                            : CYAN,
                        boxShadow: "0 0 8px rgba(0,200,255,0.4)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p
              className="text-xs tracking-widest mb-3 uppercase"
              style={{
                color: "rgba(0,200,255,0.6)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              02 / progress feedback
            </p>
            <h2
              className="text-4xl font-bold text-white mb-5"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Seeing progress changes behaviour
            </h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                A landmark MIT study (2011) found that users who could see a
                visual progress bar completed{" "}
                <strong className="text-white">34% more tasks</strong> than
                those who couldn't. The bar creates a phenomenon psychologists
                call the{" "}
                <strong className="text-white">Goal Gradient Effect</strong> the
                closer you are to completion, the faster you work.
              </p>
              <p>
                Teresa Amabile at Harvard Business School calls this the{" "}
                <strong className="text-white">"Progress Principle"</strong>:
                the single greatest motivator at work is making progress in
                meaningful work. Even small wins produce outsized boosts in
                motivation and creativity.
              </p>
              <p>
                BJ Fogg's Tiny Habits research shows that{" "}
                <strong className="text-white">immediate feedback</strong> is
                critical. The shorter the gap between action and confirmation,
                the more powerfully the behaviour is reinforced in long-term
                memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accountability Section ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-xs tracking-widest mb-3 uppercase"
            style={{
              color: "rgba(0,200,255,0.6)",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            03 / social accountability
          </p>
          <h2
            className="text-4xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            Others watching makes you work harder
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            When your peers can see what you're learning, social commitment
            pressure kicks in. Research from the Dominican University of
            California found that people who wrote down goals and shared
            progress with a friend were{" "}
            <strong className="text-white">
              76% more likely to achieve them
            </strong>
            .
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <ScienceCard icon="🧠" title="Habit Loop Theory">
            Charles Duhigg's neurological loop Cue, Routine, Reward explains why
            streaks become self-reinforcing. MasterWay's daily lesson reminders
            act as the cue; completing a lesson is the routine; your streak
            counter and feed post is the reward.
          </ScienceCard>
          <ScienceCard icon="📊" title="Loss Aversion (Kahneman)">
            Nobel laureate Daniel Kahneman proved humans feel losses roughly
            twice as intensely as equivalent gains. Losing a 14-day streak hurts
            more than gaining a new one feels good and your brain's threat
            response fires to prevent the loss.
          </ScienceCard>
          <ScienceCard icon="🤝" title="Commitment Devices">
            Economist Richard Thaler showed that public commitments dramatically
            increase follow-through. Posting "Completed lesson: Python Basics"
            to MasterWay's accountability feed creates exactly this effect
            you've told the community, now you must continue.
          </ScienceCard>
        </div>
      </section>

      {/* ── Duolingo Case Study ── */}
      <section
        className="py-20 border-y"
        style={{
          borderColor: "rgba(0,200,255,0.12)",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <div className="px-6 max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 border"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,200,255,0.06) 0%, rgba(0,0,0,0.4) 100%)",
              borderColor: "rgba(0,200,255,0.25)",
            }}
          >
            <p
              className="text-xs tracking-widest mb-4 uppercase"
              style={{
                color: "rgba(0,200,255,0.6)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              // case study: duolingo
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              How one green flame changed language learning forever
            </h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-8">
              <p>
                In 2012, Duolingo's streak feature was nearly cut. It seemed
                trivial a counter that went up by one each day you practiced.
                The product team almost didn't ship it.
              </p>
              <p>
                Then the data came in. Users with a 7-day streak were{" "}
                <strong className="text-white">10 times more likely</strong> to
                still be active 6 months later. Users with a 30-day streak
                showed a{" "}
                <strong className="text-white">
                  retention rate of over 90%
                </strong>
                . The streak had become the single most predictive metric of
                long-term engagement in the product.
              </p>
              <p>
                Duolingo went on to build "Streak Freeze" a way to protect your
                streak for one day and "Streak Repair". At its peak, over{" "}
                <strong className="text-white">3 million users per day</strong>{" "}
                were using streak freeze to protect their progress. The
                company's DAU (daily active users) grew by over 4× in the
                following two years, with streaks cited as the primary driver.
              </p>
              <p>
                Their internal research team found that the streak mechanic
                worked because it shifted users' mental model from{" "}
                <em>"I'm trying to learn Spanish"</em> to{" "}
                <em>"I don't break my streak."</em> The identity transformation
                drove the behaviour far more powerfully than motivation alone
                ever could.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Stat value="10×" label="retention at 7-day streak" />
              <Stat value="90%+" label="retention at 30-day streak" />
              <Stat value="4×" label="DAU growth driven by streaks" />
            </div>
          </div>
        </div>
      </section>

      {/* ── MasterWay Principles ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <p
          className="text-xs tracking-widest mb-3 uppercase"
          style={{
            color: "rgba(0,200,255,0.6)",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          // masterway principles
        </p>
        <h2
          className="text-4xl font-bold text-white mb-5"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          Every pixel is intentional
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          MasterWay didn't borrow these ideas we built the platform around them.
          Your streak, your progress bars, your accountability feed each is a
          deliberate implementation of peer-reviewed research on how humans
          build lasting skills.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { icon: "🔥", label: "Daily Streaks" },
            { icon: "📈", label: "Progress Tracking" },
            { icon: "🫂", label: "Accountability Feed" },
            { icon: "🎯", label: "Lesson Completion" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="rounded-xl py-5 px-4 border text-center"
              style={{
                background: "rgba(0,200,255,0.05)",
                borderColor: "rgba(0,200,255,0.18)",
              }}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <p
                className="text-white text-sm font-semibold"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-xl transition-all hover:opacity-90 text-base"
          style={{
            background: CYAN,
            color: "white",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.1em",
            boxShadow: "0 0 28px rgba(0,200,255,0.45)",
          }}
        >
          BUILD YOUR STREAK TODAY →
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
