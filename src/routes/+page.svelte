<script lang="ts">
  import {page} from '$app/stores';

  import {onMount} from 'svelte';
  import {db} from '../lib/firebase';
  import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    Timestamp,
    orderBy,
    query
  } from 'firebase/firestore';

  const day = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  let modal = false;

  let comment = '';
  let stress = 'purple';
  let tick = false;
  let touched = false;
  let meditation = false;
  let yoga = false;
  let breath = false;
  let walk = false;

  let textarea;
  let modes = [];
  onMount(async () => {
    // Open the modal directly to add a new feeling
    $page.url.searchParams.has('open') && (modal = true);

    const querySnapshot = await getDocs(query(collection(db, 'modes'), orderBy('date', 'desc')));
    querySnapshot.forEach((doc) => {
      modes.push({id: doc.id, ...doc.data()});
    });
    modes = modes;
  });

  async function addFeeling() {
    const newMode = {
      date: Timestamp.now(),
      comment,
      stress,
      tick,
      touched,
      meditation,
      yoga,
      breath,
      walk,
    };

    try {
      const docRef = await addDoc(collection(db, 'modes'), newMode);
      newMode['id'] = docRef.id;
      modes.unshift(newMode);
      modes = modes;
      resetForm();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async function deleteFeeling(id) {
    if (confirm("Delete?!")) {
      await deleteDoc(doc(db, 'modes', id));
      modes = modes.filter((mode) => mode.id !== id);
    }
  }

  function resetForm() {
    comment = '';
    stress = '';
    tick = false;
    meditation = false;
    yoga = false;
    breath = false;
    walk = false;
  }
</script>

<svelte:head>
  <title>Mode App</title>
</svelte:head>

<div class="container mx-auto prose-xl relative">
  <div class="prose bg-base-300 rounded p-4 mt-4">
    <strong>Groen</strong>: zin hebben, gefocust zijn, relativeren, lage ademhaling, stabiel,
    contact maken, positief reageren
    <br/>
    <strong>Geel</strong>: minder overzicht hebben, snel willen afhandelen, hoge ademhaling,
    geïrriteerd, kortaf reageren, lijstjes maken, klagen
    <br/>
    <strong>Paars:</strong> sussen, moeten, slecht slapen, angstgevoel, gejaagd zijn, activiteiten afzeggen,
    te moe zijn voor sport
  </div>

  <div class="flex mt-10 flex-wrap">
    <div class="text-3xl">Mijn gevoelens en acties ({modes.length})</div>
    <button on:click={() => (modal = true)} class="btn ml-10 flex gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 19q-.425 0-.713-.288T11 18v-5H6q-.425 0-.713-.288T5 12q0-.425.288-.713T6 11h5V6q0-.425.288-.713T12 5q.425 0 .713.288T13 6v5h5q.425 0 .713.288T19 12q0 .425-.288.713T18 13h-5v5q0 .425-.288.713T12 19Z"></path></svg>
      Nieuw gevoel of actie
    </button
    >
  </div>

  <!-- The button to open modal -->

  <!-- Put this part before </body> tag -->

  <input type="checkbox" bind:checked={modal} class="modal-toggle"/>


  <div class="modal">
    <div class="modal-box bg-base-200 pt-0">
      <h3 class="font-bold text-lg mb-8">Nieuw gevoel of actie</h3>
      <div>

        <div class="flex gap-10 flex-wrap">
          <!-- Gevoel-->
          <div class="">
            <div class="opacity-60 text-sm mb-4">Gevoel</div>
            <div class="flex gap-4">
              <button class={`btn btn-circle bg-purple-500 hover:bg-purple-600 border-none border-gray-300 ${stress === 'purple' && 'border-8' }`}
                      on:click={() => { (stress = 'purple'), textarea.focus();}}
              />
              <button class={`btn btn-circle bg-yellow-400 hover:bg-yellow-600 border-none border-gray-300 ${stress === 'yellow' && 'border-8'}`}
                      on:click={() => {(stress = 'yellow'), textarea.focus();}}
              />
              <button class={`btn btn-circle bg-green-400 hover:bg-green-600 border-none border-gray-300 ${stress === 'green' && 'border-8'}`}
                      on:click={() => {(stress = 'green'), textarea.focus();}}
              />
              <div class="flex-1"></div>
            </div>
          </div>

          <!-- Tick -->
          <div>
            <div class="opacity-60 text-sm mb-4">Tick (Intention - Touched)</div>
            <div class="flex gap-4 mt-4">
              <!-- Tick button -->
              <button
                  class={`btn btn-circle -rotate-45 ${
						tick === true ? 'border-4 bg-orange-500' : 'bg-orange-300'
					}  hover:bg-orange-600 border-none border-gray-300 `}
                  on:click={() => { (tick = !tick), textarea.focus(), (touched = false);}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="currentColor"
                  >
                    <path
                        d="M8 13V4.5a1.5 1.5 0 0 1 3 0V12m0-.5v-2a1.5 1.5 0 1 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12"
                    />
                    <path
                        d="M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7A69.74 69.74 0 0 1 7 19c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022a1.867 1.867 0 0 1 2.28.28L8 13"
                    />
                  </g
                  >
                </svg
                >
              </button>

              <!-- touched button -->
              <button
                  class={`btn btn-circle ${
						touched === true ? 'border-4 bg-red-500' : 'bg-red-300'
					}  hover:bg-red-600 border-none border-gray-300 `}
                  on:click={() => {
						(touched = !touched), textarea.focus(), (tick = false);
					}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M17 22q-1.55 0-2.538-.775T12.95 18.95q-.425-1.25-.812-1.75t-1.788-1.6Q8.8 14.35 7.9 12.775T7 9q0-2.975 2.013-4.987T14 2q2.975 0 4.988 2.013T21 9h-2q0-2.125-1.438-3.563T14 4q-2.125 0-3.563 1.438T9 9q0 1.7.675 2.9t1.925 2.15q1.3.95 2.025 1.85t1.075 1.95q.35 1.1.838 1.625T17 20q.825 0 1.413-.588T19 18h2q0 1.65-1.175 2.825T17 22ZM6.2 16.75q-1.475-1.5-2.338-3.488T3 9q0-2.3.863-4.3T6.2 1.2l1.45 1.4Q6.4 3.85 5.7 5.488T5 9q0 1.85.7 3.475t1.95 2.875l-1.45 1.4ZM14 11.5q-1.05 0-1.775-.738T11.5 9q0-1.05.725-1.775T14 6.5q1.05 0 1.775.725T16.5 9q0 1.025-.725 1.763T14 11.5Z"/>
                </svg
                >
              </button>
            </div>
          </div>

        </div>
      </div>
      <div class="opacity-60 text-sm mt-8 mb-3">Actie</div>

      <div class="flex gap-4">
<!--Meditation-->
        <div class="cursor-pointer label block">
          <label class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25"/><path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18"/><path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/></g></svg>
            <input type="checkbox" bind:checked={meditation} class="checkbox checkbox-warning"/>
          </label>
        </div>
<!--Yoga-->
        <div class="cursor-pointer label block">
          <label class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M152 86a30 30 0 1 0-30-30a30 30 0 0 0 30 30Zm0-48a18 18 0 1 1-18 18a18 18 0 0 1 18-18Zm66.49 100.86c-.59.27-7.17 3.13-18.88 3.13c-13.86 0-34.9-4-61.73-21a165.89 165.89 0 0 1-17.43 36.51c9.43 2.78 22 7.72 33.19 16.26C172.46 188.05 182 207.65 182 232a6 6 0 0 1-12 0c0-44-37.23-59.18-56.91-64.11q-1.2 1.55-2.46 3.09c-19.25 23.31-43.34 35.45-70.11 35.45a90.72 90.72 0 0 1-9.12-.43a6 6 0 0 1 1.2-12c26.63 2.66 49.77-7.66 68.77-30.69c13.16-15.94 21.94-35.51 26.08-49.15c-40.51-24.52-66.59-4.78-67.72-3.89a6 6 0 0 1-7.48-9.38c.37-.3 9.39-7.43 24.76-10c13.86-2.31 35.92-1.3 62.36 16.67c47.14 32 73.88 20.47 74.14 20.35a6 6 0 1 1 5 10.92Z"></path></svg>
            <input type="checkbox" bind:checked={yoga} class="checkbox checkbox-warning"/>
          </label>
        </div>
<!--        Breath-->
        <div class="cursor-pointer label block">
          <label class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="currentColor" d="M30.915 6.403a1 1 0 1 0-1.83-.806l-.004.008l-.013.03a29.938 29.938 0 0 1-.266.582a93.432 93.432 0 0 1-3.76 7.217c-2.48 4.279-5.741 9.017-9.033 11.39c-4.344 3.118-5.65 6.952-4.735 10.162c.896 3.145 3.865 5.387 7.37 5.387h3.229A2.627 2.627 0 0 1 24.5 43h2a4.627 4.627 0 0 0-4.627-4.627h-.576c.224-.336.582-.665 1.126-.918c.994-.464 2.68-.7 5.35-.08a1 1 0 1 0 .453-1.948c-2.929-.68-5.11-.503-6.649.215c-1.357.633-2.155 1.664-2.461 2.73h-.472c-2.647 0-4.805-1.683-5.446-3.935c-.624-2.187.121-5.221 3.978-7.989l.002-.001c3.67-2.645 7.111-7.725 9.595-12.01a95.504 95.504 0 0 0 3.844-7.379a56.141 56.141 0 0 0 .278-.608l.015-.034l.005-.011v-.002L30 6l.915.403Zm4.841 28.588c-.52 2.09-1.817 3.979-3.227 4.858L31.47 38.15c.882-.55 1.923-1.947 2.344-3.642c.409-1.647.195-3.408-1.16-4.815l1.44-1.388c1.947 2.022 2.192 4.547 1.66 6.685Z"></path></svg>
            <input type="checkbox" bind:checked={breath} class="checkbox checkbox-warning"/>
          </label>
        </div>
<!--        Walk-->
        <div class="cursor-pointer label block">
          <label class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="m12.44 9.127l-1.408 5.635l4.93 6.339m-5.634-2.817L8.215 21.1"></path><path d="M8.215 13.353c0-3.944 2.817-4.226 4.226-4.226h1.408c.235 1.174 1.268 3.663 3.522 4.226M13 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"></path></g></svg>
            <input type="checkbox" bind:checked={walk} class="checkbox checkbox-warning"/>
          </label>
        </div>

      </div>


      <div class="opacity-60 text-sm my-3">Comment</div>

      <textarea
          bind:this={textarea}
          placeholder="Good comments, better insights"
          class="textarea rounded-lg w-full max-w-xs"
          on:keydown={(event) => event.key === 'Enter' && (addFeeling(), (modal = false))}
          bind:value={comment}></textarea>

      <div class="modal-action gap-10">
        <button on:click={() => (modal = false)} class="btn btn-ghost" on:click={resetForm}>
          Cancel
        </button>
        <button on:click={() => (modal = false)} class="btn" on:click={addFeeling}>
          Add
        </button>
      </div>
    </div>
  </div>
  <!--  END MODAL-->


  <!--  DISPLAY LIST-->
  <ul>
    {#each modes as mode}
      <li class="flex gap-2 align-center text-md hover:bg-base-100 rounded">
        <div
            class={`-translate-y-4 circle ${mode.stress === 'purple' && 'bg-purple-500'} ${ mode.stress === 'yellow' && 'bg-yellow-500' } ${mode.stress === 'green' && 'bg-green-500'} w-10 h-10 rounded-xl`}></div>
        <div>
          <div class="flex gap-3 items-center">
            {#if mode.tick}
							<span class={`flex items-center justify-center rounded-full w-5 h-5 text-white bg-orange-500 border-none -rotate-45`}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path
                    d="M8 13V4.5a1.5 1.5 0 0 1 3 0V12m0-.5v-2a1.5 1.5 0 1 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12"/><path
                    d="M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7A69.74 69.74 0 0 1 7 19c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022a1.867 1.867 0 0 1 2.28.28L8 13"/></g></svg>
							</span>
            {/if}

            {#if mode.touched}
							<span class={`flex items-center justify-center rounded-full w-5 h-5 text-white bg-red-600 border-none`}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                ><path
                    fill="currentColor"
                    d="M17 22q-1.55 0-2.538-.775T12.95 18.95q-.425-1.25-.812-1.75t-1.788-1.6Q8.8 14.35 7.9 12.775T7 9q0-2.975 2.013-4.987T14 2q2.975 0 4.988 2.013T21 9h-2q0-2.125-1.438-3.563T14 4q-2.125 0-3.563 1.438T9 9q0 1.7.675 2.9t1.925 2.15q1.3.95 2.025 1.85t1.075 1.95q.35 1.1.838 1.625T17 20q.825 0 1.413-.588T19 18h2q0 1.65-1.175 2.825T17 22ZM6.2 16.75q-1.475-1.5-2.338-3.488T3 9q0-2.3.863-4.3T6.2 1.2l1.45 1.4Q6.4 3.85 5.7 5.488T5 9q0 1.85.7 3.475t1.95 2.875l-1.45 1.4ZM14 11.5q-1.05 0-1.775-.738T11.5 9q0-1.05.725-1.775T14 6.5q1.05 0 1.775.725T16.5 9q0 1.025-.725 1.763T14 11.5Z"
                /></svg
                >
							</span>
            {/if}


            {#if mode.meditation}
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25"/><path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18"/><path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/></g></svg>
            {/if}

            {#if mode.yoga}
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M152 86a30 30 0 1 0-30-30a30 30 0 0 0 30 30Zm0-48a18 18 0 1 1-18 18a18 18 0 0 1 18-18Zm66.49 100.86c-.59.27-7.17 3.13-18.88 3.13c-13.86 0-34.9-4-61.73-21a165.89 165.89 0 0 1-17.43 36.51c9.43 2.78 22 7.72 33.19 16.26C172.46 188.05 182 207.65 182 232a6 6 0 0 1-12 0c0-44-37.23-59.18-56.91-64.11q-1.2 1.55-2.46 3.09c-19.25 23.31-43.34 35.45-70.11 35.45a90.72 90.72 0 0 1-9.12-.43a6 6 0 0 1 1.2-12c26.63 2.66 49.77-7.66 68.77-30.69c13.16-15.94 21.94-35.51 26.08-49.15c-40.51-24.52-66.59-4.78-67.72-3.89a6 6 0 0 1-7.48-9.38c.37-.3 9.39-7.43 24.76-10c13.86-2.31 35.92-1.3 62.36 16.67c47.14 32 73.88 20.47 74.14 20.35a6 6 0 1 1 5 10.92Z"></path></svg>

            {/if}

            {#if mode.breath}
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="currentColor" d="M30.915 6.403a1 1 0 1 0-1.83-.806l-.004.008l-.013.03a29.938 29.938 0 0 1-.266.582a93.432 93.432 0 0 1-3.76 7.217c-2.48 4.279-5.741 9.017-9.033 11.39c-4.344 3.118-5.65 6.952-4.735 10.162c.896 3.145 3.865 5.387 7.37 5.387h3.229A2.627 2.627 0 0 1 24.5 43h2a4.627 4.627 0 0 0-4.627-4.627h-.576c.224-.336.582-.665 1.126-.918c.994-.464 2.68-.7 5.35-.08a1 1 0 1 0 .453-1.948c-2.929-.68-5.11-.503-6.649.215c-1.357.633-2.155 1.664-2.461 2.73h-.472c-2.647 0-4.805-1.683-5.446-3.935c-.624-2.187.121-5.221 3.978-7.989l.002-.001c3.67-2.645 7.111-7.725 9.595-12.01a95.504 95.504 0 0 0 3.844-7.379a56.141 56.141 0 0 0 .278-.608l.015-.034l.005-.011v-.002L30 6l.915.403Zm4.841 28.588c-.52 2.09-1.817 3.979-3.227 4.858L31.47 38.15c.882-.55 1.923-1.947 2.344-3.642c.409-1.647.195-3.408-1.16-4.815l1.44-1.388c1.947 2.022 2.192 4.547 1.66 6.685Z"></path></svg>

            {/if}

            {#if mode.walk}
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="m12.44 9.127l-1.408 5.635l4.93 6.339m-5.634-2.817L8.215 21.1"></path><path d="M8.215 13.353c0-3.944 2.817-4.226 4.226-4.226h1.408c.235 1.174 1.268 3.663 3.522 4.226M13 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"></path></g></svg>

            {/if}

            <div class={`${!mode.comment && 'opacity-50 italic'} text-[1rem]`}>
              {mode.comment || 'no comment'}
            </div>
          </div>
          <div class="text-sm">
            {mode.date?.toDate().getDate()}
            {mode.date?.toDate().toLocaleString('default', { month: 'long' })}, {day[
            mode.date?.toDate().getDay()
            ]}
            om
            {mode.date?.toDate().getHours()}:{String(mode.date?.toDate().getMinutes()).padStart(
            2,
            '0'
          )}
            <button on:click={() => deleteFeeling(mode.id)}><span class="ml-4">🗑️</span></button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>

