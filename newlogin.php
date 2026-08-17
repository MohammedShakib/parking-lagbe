<?php
// (optional) PHP handler
// session_start();
// if($_SERVER['REQUEST_METHOD']==='POST'){ /* validate & redirect */ }
?>
<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Log In — Cars Animated</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
  :root{
    --ink:#111827; --muted:#6B7280;
    --bg:#FFFEFA; --panel:#FFFFFF;
    --brand:#F59E0B; --brand2:#FBBF24;
    --ring:#FEF3C7; --line:#FFE9A6;
    --shadow:0 20px 50px rgba(17,24,39,.10);
  }
  *{box-sizing:border-box} html,body{height:100%}
  body{
    margin:0; font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; color:var(--ink);
    background:
      radial-gradient(900px 420px at 110% -10%, #FFF5CC 0%, transparent 60%),
      radial-gradient(760px 380px at -10% 110%, #FFF0B8 0%, transparent 55%),
      linear-gradient(180deg,#FFFDF6 0%,#FFF9E8 100%);
  }
  a{color:#B45309;text-decoration:none} a:hover{text-decoration:underline}
  .wrap{min-height:100%;display:grid;place-items:center;padding:32px 18px}
  .shell{
    width:min(1100px,100%); display:grid; grid-template-columns:1.1fr .9fr;
    border-radius:28px; overflow:hidden; box-shadow:var(--shadow); background:var(--panel);
  }

  /* ---------- LEFT: animated cars scene ---------- */
  .scene{
    position:relative; min-height:560px; background:#130d02; isolation:isolate; overflow:hidden;
  }
  .scene .sun{
    position:absolute; top:42px; left:54px; width:90px; height:90px; border-radius:50%;
    background:radial-gradient(circle at 30% 30%, #FFE08A, #F7B500 60%, #EBA300);
    box-shadow:0 0 80px 20px rgba(247,181,0,.35); animation:sunPulse 6s ease-in-out infinite;
  }
  @keyframes sunPulse{50%{transform:scale(1.06)}}

  /* clouds (soft) */
  .cloud{position:absolute; top:80px; left:-220px; width:200px; height:70px; opacity:.9; filter:blur(.3px); animation:cloud 28s linear infinite}
  .cloud.two{top:140px; transform:scale(.9); animation-delay:3s}
  .cloud svg{width:100%; height:100%}
  @keyframes cloud{from{transform:translateX(-10%)} to{transform:translateX(120%)}}

  /* ground & roads */
  .ground{position:absolute; inset:auto 0 0 0; height:210px; background:linear-gradient(#1b1202 0 50%, #2b1b03 50%)}
  .road{
    position:absolute; left:-20%; right:-20%; height:88px; background:#2d240e;
    box-shadow:0 12px 30px rgba(0,0,0,.25) inset;
  }
  .road.top{bottom:112px; transform:skewX(-8deg)}
  .road.mid{bottom:54px}
  .road.bot{bottom:8px; transform:skewX(6deg)}

  .dash{
    position:absolute; left:0; right:0; top:50%; height:2px; transform:translateY(-50%);
    background:repeating-linear-gradient(90deg,#FFE08A 0 70px, transparent 70px 140px);
    animation:dash 2s linear infinite;
  }
  .road.top .dash{animation-duration:1.6s; opacity:.75}
  .road.bot .dash{animation-duration:2.6s; opacity:.9}
  @keyframes dash{to{background-position:-140px 0}}

  /* cars */
  .car{
    position:absolute; user-select:none; -webkit-user-drag:none;
    filter:drop-shadow(0 12px 18px rgba(0,0,0,.35));
  }
  /* front 3D cartoon car (car01) on top road */
  .car-a{
    width:340px; bottom:140px; left:-380px; transform-origin:center;
    animation:
      drive-a 10s linear infinite,
      bob 1.6s ease-in-out infinite,
      tilt 4s ease-in-out infinite;
  }
  @keyframes drive-a{0%{left:-380px}100%{left:115%}}
  /* side white car (car03) on middle road */
  .car-b{
    width:420px; bottom:72px; right:-480px; transform-origin:center;
    animation:
      drive-b 12s linear infinite,
      bob 1.8s ease-in-out infinite reverse,
      tilt 5s ease-in-out infinite reverse;
  }
  @keyframes drive-b{0%{right:-480px}100%{right:115%}}

  /* top-view yellow car on bottom road */
  .car-top{
    width:260px; bottom:20px; left:-300px; transform-origin:center;
    animation:
      drive-top 8s linear infinite,
      bob 1.5s ease-in-out infinite;
  }
  @keyframes drive-top{0%{left:-300px}100%{left:115%}}

  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes tilt{0%,100%{rotate:-1deg}50%{rotate:1deg}}

  .tag{
    position:absolute; left:24px; top:24px; display:inline-flex; gap:10px; align-items:center;
    padding:10px 14px; border-radius:999px; background:#FFF7E0; color:#92400E; font-weight:700;
    box-shadow:0 6px 18px rgba(146,64,14,.15); z-index:5;
  }
  .dot{width:10px;height:10px;border-radius:50%;background:var(--brand)}
  .toast{
    position:absolute; left:24px; bottom:22px; right:24px;
    background:#FFFFFFC2; color:#3a2b05; border:1px solid #FFF0BF; border-radius:16px; padding:18px 20px;
    box-shadow:0 8px 24px rgba(245,158,11,.18); backdrop-filter: blur(10px);
  }
  .toast h3{margin:0 0 6px;font-size:18px} .toast p{margin:0;font-size:14px;opacity:.9}

  /* ---------- RIGHT: form ---------- */
  .panel{padding:44px 48px; background:radial-gradient(70% 140% at 0% 0%, #FFFDF1 0%, transparent 60%), #fff;}
  .brand{display:flex;align-items:center;gap:10px;margin-bottom:6px;color:#B45309;font-weight:700}
  .brand svg{width:22px;height:22px}
  h1{margin:2px 0 4px; font-size:32px; line-height:1.2}
  .sub{color:var(--muted); font-size:14px; margin-bottom:14px}

  form{display:grid; gap:14px; margin-top:8px}
  .field{position:relative}
  .input{
    width:100%; background:#fff; border:1.5px solid var(--line);
    border-radius:14px; padding:22px 44px 10px 46px; font-size:15px;
    transition:.15s border-color,.15s box-shadow,.15s background-color;
  }
  .input::placeholder{opacity:0}
  .input:focus{outline:none; border-color:var(--brand); box-shadow:0 0 0 6px var(--ring); background:#FFFEFB}
  .label{position:absolute; left:46px; top:12px; font-size:12px; color:#9A8A56; letter-spacing:.02em}
  .icon{position:absolute; left:14px; top:50%; translate:0 -50%; width:22px; height:22px; color:#9B7A3C; opacity:.9}
  .pw-toggle{position:absolute; right:12px; top:50%; translate:0 -50%; border:none; background:transparent; cursor:pointer; padding:6px; color:#9B7A3C}

  .row{display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:4px}
  .remember{display:flex; align-items:center; gap:8px; font-size:14px; color:#5C5133}
  .remember input{accent-color:var(--brand)}

  .btn{
    appearance:none; border:none; cursor:pointer; border-radius:14px; padding:14px 18px; font-weight:700; font-size:16px;
    background:linear-gradient(90deg,var(--brand),var(--brand2)); color:#1F2937;
    box-shadow:0 12px 26px rgba(245,158,11,.28); transition:transform .04s ease-in-out, filter .2s ease;
  }
  .btn:active{transform:translateY(1px)}

  .or{display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:12px; color:#a8893a; font-size:12px; margin:10px 0}
  .or::before,.or::after{content:""; height:1px; background:#FFEAA0}
  .social{display:flex; gap:12px; flex-wrap:wrap}
  .sbtn{
    flex:1 1 180px; display:flex; align-items:center; justify-content:center; gap:10px;
    background:#fff; border:1.5px solid #FFEDAD; border-radius:14px; padding:12px 14px; cursor:pointer;
    transition:.15s border-color,.15s transform;
  }
  .sbtn:hover{border-color:#FFE38A; transform:translateY(-1px)}
  .foot{margin-top:6px; font-size:14px; color:#7a6b40}

  /* responsive */
  @media (max-width:980px){
    .shell{grid-template-columns:1fr}
    .scene{order:-1; min-height:340px}
    .panel{padding:30px 22px}
    h1{font-size:26px}
    .car-a{width:270px}
    .car-b{width:330px}
    .car-top{width:220px}
  }
</style>
</head>
<body>
<main class="wrap">
  <section class="shell" aria-label="Login with animated cars">
    <!-- LEFT -->
    <aside class="scene" aria-hidden="true">
      <div class="sun"></div>

      <!-- clouds -->
      <div class="cloud">
        <svg viewBox="0 0 200 70" fill="none"><path fill="#FFF6D7" d="M38 52c-14 0-26-8-26-18s12-18 26-18c5 0 9 1 13 3 4-8 13-13 23-13 15 0 27 10 27 22 0 2 0 4-1 6h9c12 0 21 7 21 16S144 66 132 66H38c-7 0-13-6-13-14s6-14 13-14z"/></svg>
      </div>
      <div class="cloud two">
        <svg viewBox="0 0 200 70" fill="none"><path fill="#FFF2C5" d="M38 52c-14 0-26-8-26-18s12-18 26-18c5 0 9 1 13 3 4-8 13-13 23-13 15 0 27 10 27 22 0 2 0 4-1 6h9c12 0 21 7 21 16S144 66 132 66H38c-7 0-13-6-13-14s6-14 13-14z"/></svg>
      </div>

      <!-- roads -->
      <div class="ground">
        <div class="road top"><div class="dash"></div></div>
        <div class="road mid"><div class="dash"></div></div>
        <div class="road bot"><div class="dash"></div></div>
      </div>

      <!-- cars (use your images) -->
      <img class="car car-a" src="car01.png" alt="" loading="lazy">
      <img class="car car-b" src="car03.png" alt="" loading="lazy">
      <img class="car car-top" src="car-top.png" alt="" loading="lazy">

      <div class="tag"><span class="dot"></span> Log In</div>
      <div class="toast">
        <h3>Welcome back 👋</h3>
        <p>Stay focused. Track your progress. Keep moving.</p>
      </div>
    </aside>

    <!-- RIGHT -->
    <div class="panel">
      <div class="brand">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 4.6L18 8.5l-4.1 1.9L12 15l-1.9-4.6L6 8.5l4.1-1.9L12 2zM5 18l.9 2.1L8 21l-2.1.9L5 24l-.9-2.1L2 21l2.1-.9L5 18zm14-3l1.4 3.2L24 20l-3.6 1.6L19 25l-1.4-3.4L14 20l3.6-1.8L19 15z"/></svg>
        Team Miracle
      </div>
      <h1>আপনার একাউন্টে প্রবেশ করুন</h1>
      <p class="sub">স্বাগতম! লগইন করতে আপনার তথ্য দিন</p>

      <form id="loginForm" method="post" action="">
        <div class="field">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>
          <input class="input" type="email" name="email" id="email" placeholder="you@example.com" required>
          <span class="label">Email</span>
        </div>

        <div class="field">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm3 8H9V6a3 3 0 1 1 6 0v3z"/></svg>
          <input class="input" type="password" name="password" id="password" placeholder="••••••••" minlength="6" required>
          <span class="label">Password</span>
          <button class="pw-toggle" type="button" id="togglePw" aria-label="Show password">👁️</button>
        </div>

        <div class="row">
          <label class="remember"><input type="checkbox" name="remember"> Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button class="btn" type="submit" name="login">Log in</button>

        <div class="or">Or continue with</div>
        <div class="social">
          <button class="sbtn" type="button"><img alt="" src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" height="20"> Google</button>
          <button class="sbtn" type="button"><img alt="" src="https://www.svgrepo.com/show/475647/facebook-color.svg" width="20" height="20"> Facebook</button>
        </div>
        <p class="foot">একাউন্ট নেই? <a href="#">Sign up</a></p>
      </form>
    </div>
  </section>
</main>

<script>
  // password toggle
  const pw = document.getElementById('password');
  const toggle = document.getElementById('togglePw');
  toggle.addEventListener('click', () => {
    const show = pw.type === 'password';
    pw.type = show ? 'text' : 'password';
    toggle.textContent = show ? '🙈' : '👁️';
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  // quick client validation
  document.getElementById('loginForm').addEventListener('submit', (e)=>{
    if(!pw.checkValidity() || !email.checkValidity()){ e.preventDefault(); }
  });
</script>
</body>
</html>
