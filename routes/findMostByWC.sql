SELECT
  t2.id,
  t2.name,
  t2.code,
  array_to_string(array_agg(episode_words ORDER BY season_num, episode_num), ',') AS raw_cnt_by_ep,
  array_to_string(array_agg(mov_ave ORDER BY season_num, episode_num), ',') AS mov_ave_by_ep,
  array_to_string(array_agg(avg_per_episode ORDER BY season_num, episode_num), ',') AS cumul_ave_by_ep
FROM 
(
SELECT
  t.id,
  t.name,
  t.code,
  t.season_num,
  t.episode_num,
  t.episode_words,
  ROUND(AVG(t.episode_words) OVER (PARTITION BY t.name ORDER BY t.season_num, t.episode_num ROWS BETWEEN 2 PRECEDING AND 0 PRECEDING)) AS mov_ave,
  ROUND(AVG(t.episode_words) OVER (PARTITION BY t.name ORDER BY t.season_num, t.episode_num)) AS avg_per_episode

FROM (
SELECT
  c.character_id AS id,
  c.name,
  c.code,
  s.num AS season_num,
  e.num AS episode_num,
  SUM(CASE WHEN l.num_words IS NULL THEN 0 ELSE l.num_words END) AS episode_words
FROM characters c
  INNER JOIN episodes e ON e.air_date <= CURRENT_DATE
  INNER JOIN seasons s ON e.season_id = s.season_id
  LEFT JOIN scenes sc ON e.episode_id = sc.episode_id
  LEFT JOIN lines l ON sc.scene_id = l.scene_id
    AND c.character_id = l.character_id
WHERE c.name IS NOT NULL
GROUP BY c.character_id, c.name, c.code, s.num, e.num
ORDER BY s.num, e.num
) t
) t2
GROUP BY t2.id, t2.name, t2.code
ORDER BY SUM(t2.episode_words) DESC
LIMIT 
